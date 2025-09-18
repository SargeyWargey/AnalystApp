import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { setupApplicationMenu } from './menu'
import { markdownConverter } from '../src/core/services/markdownConverter'

// Terminal functionality with node-pty
let pty: any = null;
try {
  pty = require('node-pty');
  console.log('Terminal functionality enabled with node-pty');
} catch (error) {
  console.error('Failed to load node-pty:', error);
  console.warn('Terminal functionality is disabled due to node-pty loading issues');
}

// Settings management
interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  sidebarCollapsed: boolean;
  defaultOutputDirectory?: string;
  preserveFileStructure: boolean;
  showConversionProgress: boolean;
  autoOpenOutput: boolean;
  defaultShell?: string;
  terminalFontSize: number;
  terminalFontFamily: string;
  maxTerminalHistory: number;
  clearTerminalOnStart: boolean;
  windowBounds: { width: number; height: number; x?: number; y?: number; };
  alwaysOnTop: boolean;
  minimizeToTray: boolean;
  enableDebugMode: boolean;
  maxErrorLogSize: number;
  checkForUpdates: boolean;
  sendUsageStatistics: boolean;
  recentFiles: string[];
  recentDirectories: string[];
}

const defaultSettings: AppSettings = {
  theme: 'system',
  fontSize: 14,
  sidebarCollapsed: false,
  preserveFileStructure: true,
  showConversionProgress: true,
  autoOpenOutput: false,
  terminalFontSize: 14,
  terminalFontFamily: 'Monaco, Consolas, "Courier New", monospace',
  maxTerminalHistory: 1000,
  clearTerminalOnStart: false,
  windowBounds: { width: 1200, height: 800 },
  alwaysOnTop: false,
  minimizeToTray: false,
  enableDebugMode: false,
  maxErrorLogSize: 100,
  checkForUpdates: true,
  sendUsageStatistics: false,
  recentFiles: [],
  recentDirectories: [],
};

let userSettings: AppSettings = { ...defaultSettings };
let settingsPath: string;

// Settings management functions
function loadSettings(): void {
  try {
    settingsPath = path.join(app.getPath('userData'), 'settings.json');

    if (fs.existsSync(settingsPath)) {
      const settingsData = fs.readFileSync(settingsPath, 'utf8');
      const loadedSettings = JSON.parse(settingsData);
      userSettings = { ...defaultSettings, ...loadedSettings };
    } else {
      saveSettings();
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    userSettings = { ...defaultSettings };
  }
}

function saveSettings(): void {
  try {
    const settingsDir = path.dirname(settingsPath);
    if (!fs.existsSync(settingsDir)) {
      fs.mkdirSync(settingsDir, { recursive: true });
    }
    fs.writeFileSync(settingsPath, JSON.stringify(userSettings, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

const isDev = process.env.NODE_ENV === 'development'

// Terminal management
const terminals = new Map<string, any>()
let mainWindowRef: BrowserWindow | null = null

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    show: false,
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    // Setup application menu after window is ready
    setupApplicationMenu(mainWindow)
  })

  // Store reference for terminal communication
  mainWindowRef = mainWindow
}

// IPC Handlers
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Directory',
  })
  return result
})

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Folder',
  })
  return result
})

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    title: 'Select Files to Convert',
    filters: [
      { name: 'All Supported Files', extensions: ['pdf', 'docx', 'pptx', 'xlsx', 'doc', 'ppt', 'xls', 'html', 'htm', 'csv', 'json', 'xml', 'txt', 'zip', 'epub', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'mp3', 'wav', 'm4a', 'flac'] },
      { name: 'Documents', extensions: ['pdf', 'docx', 'doc', 'txt'] },
      { name: 'Presentations', extensions: ['pptx', 'ppt'] },
      { name: 'Spreadsheets', extensions: ['xlsx', 'xls', 'csv'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'bmp', 'gif'] },
      { name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'flac'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
  return result
})

ipcMain.handle('read-directory', async (_, dirPath: string) => {
  try {
    // Validate directory path
    if (!dirPath || typeof dirPath !== 'string') {
      throw new Error('Invalid directory path provided')
    }

    // Check if directory exists
    if (!fs.existsSync(dirPath)) {
      throw new Error(`Directory does not exist: ${dirPath}`)
    }

    // Check if path is actually a directory
    const stats = await fs.promises.stat(dirPath)
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${dirPath}`)
    }

    // Check read permissions
    try {
      await fs.promises.access(dirPath, fs.constants.R_OK)
    } catch {
      throw new Error(`No read permission for directory: ${dirPath}`)
    }

    const items = await fs.promises.readdir(dirPath, { withFileTypes: true })
    return {
      success: true,
      items: items.map((item) => ({
        name: item.name,
        path: path.join(dirPath, item.name),
        type: item.isDirectory() ? 'directory' : 'file',
      }))
    }
  } catch (error: any) {
    console.error('Error reading directory:', error)
    return {
      success: false,
      error: error.message || 'Failed to read directory',
      code: 'DIRECTORY_READ_ERROR'
    }
  }
})

// File operations
ipcMain.handle('read-file', async (_, filePath: string) => {
  try {
    // Validate file path
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided')
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`)
    }

    // Check if path is actually a file
    const stats = await fs.promises.stat(filePath)
    if (!stats.isFile()) {
      throw new Error(`Path is not a file: ${filePath}`)
    }

    // Check read permissions
    try {
      await fs.promises.access(filePath, fs.constants.R_OK)
    } catch (accessError) {
      throw new Error(`No read permission for file: ${filePath}`)
    }

    // Read file content
    const content = await fs.promises.readFile(filePath, 'utf8')
    return content
  } catch (error: any) {
    console.error('Error reading file:', error)
    throw error
  }
})

ipcMain.handle('get-file-stats', async (_, filePath: string) => {
  try {
    // Validate file path
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided')
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`)
    }

    // Get file stats
    const stats = await fs.promises.stat(filePath)
    return {
      size: stats.size,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      modified: stats.mtime,
      created: stats.birthtime,
    }
  } catch (error: any) {
    console.error('Error getting file stats:', error)
    throw error
  }
})

// Terminal IPC Handlers
ipcMain.handle('create-terminal', async (_, cwd?: string) => {
  try {
    if (!pty) {
      return {
        success: false,
        error: 'Terminal functionality is not available. node-pty module could not be loaded.',
        code: 'TERMINAL_NOT_AVAILABLE'
      }
    }

    const terminalId = `terminal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Validate and set working directory
    const workingDir = cwd || process.env.HOME || process.env.USERPROFILE || process.cwd()

    // Check if working directory exists and is accessible
    if (!fs.existsSync(workingDir)) {
      throw new Error(`Working directory does not exist: ${workingDir}`)
    }

    try {
      const stats = await fs.promises.stat(workingDir)
      if (!stats.isDirectory()) {
        throw new Error(`Working directory path is not a directory: ${workingDir}`)
      }
    } catch (statError: any) {
      throw new Error(`Cannot access working directory: ${workingDir} - ${statError.message}`)
    }

    // Determine the best shell and arguments
    let shell: string
    let args: string[] = []

    if (process.platform === 'win32') {
      shell = 'powershell.exe'
      args = []
    } else {
      // macOS/Linux
      shell = process.env.SHELL || '/bin/bash'
      if (shell.includes('zsh')) {
        shell = '/bin/zsh'
      } else {
        shell = '/bin/bash'
      }
    }

    const terminal = pty.spawn(shell, args, {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd: workingDir,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
      },
    })

    terminal.onData((data: string) => {
      if (mainWindowRef && !mainWindowRef.isDestroyed()) {
        mainWindowRef.webContents.send('terminal-data', {
          terminalId,
          data,
        })
      }
    })

    terminal.onExit((data: { exitCode: number; signal: number }) => {
      console.log(`Terminal ${terminalId} exited with code ${data.exitCode}, signal ${data.signal}`)
      terminals.delete(terminalId)
      if (mainWindowRef && !mainWindowRef.isDestroyed()) {
        mainWindowRef.webContents.send('terminal-closed', { terminalId, exitCode: data.exitCode, signal: data.signal })
      }
    })

    // Let the terminal start clean without welcome messages

    terminals.set(terminalId, terminal)
    return {
      success: true,
      terminalId,
      workingDirectory: workingDir
    }
  } catch (error: any) {
    console.error('Error creating terminal:', error)
    return {
      success: false,
      error: error.message || 'Failed to create terminal',
      code: 'TERMINAL_CREATE_ERROR'
    }
  }
})

ipcMain.handle('destroy-terminal', async (_, terminalId: string) => {
  const terminal = terminals.get(terminalId)
  if (terminal) {
    terminal.kill()
    terminals.delete(terminalId)
  }
})

ipcMain.handle('write-to-terminal', async (_, terminalId: string, data: string) => {
  const terminal = terminals.get(terminalId)
  if (terminal) {
    terminal.write(data)
  }
})

// Settings IPC Handlers
ipcMain.handle('settings-get', async () => {
  return userSettings;
});

ipcMain.handle('settings-update', async (_, updates: Partial<AppSettings>) => {
  userSettings = { ...userSettings, ...updates };
  saveSettings();
  return userSettings;
});

ipcMain.handle('settings-reset', async () => {
  userSettings = { ...defaultSettings };
  saveSettings();
  return userSettings;
});

ipcMain.handle('settings-add-recent-file', async (_, filePath: string) => {
  userSettings.recentFiles = [filePath, ...userSettings.recentFiles.filter(f => f !== filePath)].slice(0, 10);
  saveSettings();
  return userSettings;
});

ipcMain.handle('settings-add-recent-directory', async (_, dirPath: string) => {
  userSettings.recentDirectories = [dirPath, ...userSettings.recentDirectories.filter(d => d !== dirPath)].slice(0, 10);
  saveSettings();
  return userSettings;
});

// System Integration IPC Handlers
ipcMain.handle('system-open-file', async (_, filePath: string) => {
  try {
    await shell.openPath(filePath);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('system-show-in-folder', async (_, filePath: string) => {
  try {
    shell.showItemInFolder(filePath);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('system-open-url', async (_, url: string) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('system-get-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: process.version,
    isPackaged: app.isPackaged,
    execPath: process.execPath,
    appVersion: app.getVersion(),
    userData: app.getPath('userData'),
    documents: app.getPath('documents'),
    downloads: app.getPath('downloads'),
  };
});

// Markdown Conversion IPC Handlers
ipcMain.handle('markdown-get-supported-extensions', async () => {
  try {
    return await markdownConverter.getSupportedExtensions();
  } catch (error: any) {
    console.error('Error getting supported extensions:', error);
    return { success: false, error: error.message || 'Failed to get supported extensions' };
  }
});

ipcMain.handle('markdown-convert-file', async (_, inputPath: string, outputPath?: string) => {
  try {
    console.log('IPC: Converting file:', inputPath, 'to:', outputPath);
    return await markdownConverter.convertFile(inputPath, outputPath);
  } catch (error: any) {
    console.error('Error converting file:', error);
    return { success: false, error: error.message || 'File conversion failed' };
  }
});

ipcMain.handle('markdown-is-file-supported', async (_, filePath: string) => {
  try {
    return await markdownConverter.isFileSupported(filePath);
  } catch (error: any) {
    console.error('Error checking file support:', error);
    return false;
  }
});

// Handle file associations and protocol
const supportedExtensions = ['.pdf', '.docx', '.xlsx', '.pptx', '.html', '.txt', '.md'];

const isSupportedFile = (filePath: string): boolean => {
  const ext = path.extname(filePath).toLowerCase();
  return supportedExtensions.includes(ext);
};

// Handle files opened with the app
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (isSupportedFile(filePath) && mainWindowRef && !mainWindowRef.isDestroyed()) {
    mainWindowRef.webContents.send('file-opened-with-app', { filePath });
  }
});

// Handle protocol URLs (analystapp://)
app.setAsDefaultProtocolClient('analystapp');

app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindowRef && !mainWindowRef.isDestroyed()) {
    mainWindowRef.webContents.send('protocol-url-opened', { url });
  }
});

// Handle second instance (Windows/Linux)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_, commandLine) => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindowRef) {
      if (mainWindowRef.isMinimized()) mainWindowRef.restore();
      mainWindowRef.focus();

      // Check for file or protocol in command line
      const potentialFile = commandLine.find(arg =>
        isSupportedFile(arg) && fs.existsSync(arg)
      );
      const protocolUrl = commandLine.find(arg => arg.startsWith('analystapp://'));

      if (potentialFile) {
        mainWindowRef.webContents.send('file-opened-with-app', { filePath: potentialFile });
      } else if (protocolUrl) {
        mainWindowRef.webContents.send('protocol-url-opened', { url: protocolUrl });
      }
    }
  });
}

app.whenReady().then(() => {
  loadSettings();
  createWindow()

  // Check for file in command line arguments
  if (process.argv.length > 1) {
    const potentialFile = process.argv[process.argv.length - 1];
    if (isSupportedFile(potentialFile) && fs.existsSync(potentialFile)) {
      setTimeout(() => {
        if (mainWindowRef && !mainWindowRef.isDestroyed()) {
          mainWindowRef.webContents.send('file-opened-with-app', { filePath: potentialFile });
        }
      }, 1000);
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})