"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const menu_1 = require("./menu");
// Terminal functionality with node-pty
let pty = null;
try {
    pty = require('node-pty');
    console.log('Terminal functionality enabled with node-pty');
}
catch (error) {
    console.error('Failed to load node-pty:', error);
    console.warn('Terminal functionality is disabled due to node-pty loading issues');
}
const defaultSettings = {
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
let userSettings = { ...defaultSettings };
let settingsPath;
// Settings management functions
function loadSettings() {
    try {
        settingsPath = path.join(electron_1.app.getPath('userData'), 'settings.json');
        if (fs.existsSync(settingsPath)) {
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            const loadedSettings = JSON.parse(settingsData);
            userSettings = { ...defaultSettings, ...loadedSettings };
        }
        else {
            saveSettings();
        }
    }
    catch (error) {
        console.error('Error loading settings:', error);
        userSettings = { ...defaultSettings };
    }
}
function saveSettings() {
    try {
        const settingsDir = path.dirname(settingsPath);
        if (!fs.existsSync(settingsDir)) {
            fs.mkdirSync(settingsDir, { recursive: true });
        }
        fs.writeFileSync(settingsPath, JSON.stringify(userSettings, null, 2), 'utf8');
    }
    catch (error) {
        console.error('Error saving settings:', error);
    }
}
const isDev = process.env.NODE_ENV === 'development';
// Terminal management
const terminals = new Map();
let mainWindowRef = null;
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
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
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        // Setup application menu after window is ready
        (0, menu_1.setupApplicationMenu)(mainWindow);
    });
    // Store reference for terminal communication
    mainWindowRef = mainWindow;
}
// IPC Handlers
electron_1.ipcMain.handle('select-directory', async () => {
    const result = await electron_1.dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select Directory',
    });
    return result;
});
electron_1.ipcMain.handle('select-folder', async () => {
    const result = await electron_1.dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: 'Select Folder',
    });
    return result;
});
electron_1.ipcMain.handle('read-directory', async (_, dirPath) => {
    try {
        // Validate directory path
        if (!dirPath || typeof dirPath !== 'string') {
            throw new Error('Invalid directory path provided');
        }
        // Check if directory exists
        if (!fs.existsSync(dirPath)) {
            throw new Error(`Directory does not exist: ${dirPath}`);
        }
        // Check if path is actually a directory
        const stats = await fs.promises.stat(dirPath);
        if (!stats.isDirectory()) {
            throw new Error(`Path is not a directory: ${dirPath}`);
        }
        // Check read permissions
        try {
            await fs.promises.access(dirPath, fs.constants.R_OK);
        }
        catch {
            throw new Error(`No read permission for directory: ${dirPath}`);
        }
        const items = await fs.promises.readdir(dirPath, { withFileTypes: true });
        return {
            success: true,
            items: items.map((item) => ({
                name: item.name,
                path: path.join(dirPath, item.name),
                type: item.isDirectory() ? 'directory' : 'file',
            }))
        };
    }
    catch (error) {
        console.error('Error reading directory:', error);
        return {
            success: false,
            error: error.message || 'Failed to read directory',
            code: 'DIRECTORY_READ_ERROR'
        };
    }
});
// Terminal IPC Handlers
electron_1.ipcMain.handle('create-terminal', async (_, cwd) => {
    try {
        if (!pty) {
            return {
                success: false,
                error: 'Terminal functionality is not available. node-pty module could not be loaded.',
                code: 'TERMINAL_NOT_AVAILABLE'
            };
        }
        const terminalId = `terminal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Validate and set working directory
        const workingDir = cwd || process.env.HOME || process.env.USERPROFILE || process.cwd();
        // Check if working directory exists and is accessible
        if (!fs.existsSync(workingDir)) {
            throw new Error(`Working directory does not exist: ${workingDir}`);
        }
        try {
            const stats = await fs.promises.stat(workingDir);
            if (!stats.isDirectory()) {
                throw new Error(`Working directory path is not a directory: ${workingDir}`);
            }
        }
        catch (statError) {
            throw new Error(`Cannot access working directory: ${workingDir} - ${statError.message}`);
        }
        // Determine the best shell and arguments
        let shell;
        let args = [];
        if (process.platform === 'win32') {
            shell = 'powershell.exe';
            args = ['-NoExit', '-Command', '& {',
                'Write-Host "Claude Code Terminal Ready!" -ForegroundColor Green;',
                'Write-Host "Available commands: claude, git, npm, node" -ForegroundColor Yellow;',
                'if (Get-Command claude -ErrorAction SilentlyContinue) { Write-Host "✓ Claude Code detected" -ForegroundColor Green } else { Write-Host "! Claude Code not found in PATH" -ForegroundColor Red }',
                '}'
            ];
        }
        else {
            // macOS/Linux
            shell = process.env.SHELL || '/bin/bash';
            if (shell.includes('zsh')) {
                shell = '/bin/zsh';
            }
            else {
                shell = '/bin/bash';
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
        });
        terminal.onData((data) => {
            if (mainWindowRef && !mainWindowRef.isDestroyed()) {
                mainWindowRef.webContents.send('terminal-data', {
                    terminalId,
                    data,
                });
            }
        });
        terminal.onExit((data) => {
            console.log(`Terminal ${terminalId} exited with code ${data.exitCode}, signal ${data.signal}`);
            terminals.delete(terminalId);
            if (mainWindowRef && !mainWindowRef.isDestroyed()) {
                mainWindowRef.webContents.send('terminal-closed', { terminalId, exitCode: data.exitCode, signal: data.signal });
            }
        });
        // Send welcome message for Unix systems
        if (process.platform !== 'win32') {
            setTimeout(() => {
                if (terminals.has(terminalId)) {
                    terminal.write('\r\n\x1b[32mClaude Code Terminal Ready!\x1b[0m\r\n');
                    terminal.write('\x1b[33mAvailable commands: claude, git, npm, node\x1b[0m\r\n');
                    terminal.write('which claude > /dev/null 2>&1 && echo "\\x1b[32m✓ Claude Code detected\\x1b[0m" || echo "\\x1b[31m! Claude Code not found in PATH\\x1b[0m"\r\n');
                }
            }, 500);
        }
        terminals.set(terminalId, terminal);
        return {
            success: true,
            terminalId,
            workingDirectory: workingDir
        };
    }
    catch (error) {
        console.error('Error creating terminal:', error);
        return {
            success: false,
            error: error.message || 'Failed to create terminal',
            code: 'TERMINAL_CREATE_ERROR'
        };
    }
});
electron_1.ipcMain.handle('destroy-terminal', async (_, terminalId) => {
    const terminal = terminals.get(terminalId);
    if (terminal) {
        terminal.kill();
        terminals.delete(terminalId);
    }
});
electron_1.ipcMain.handle('write-to-terminal', async (_, terminalId, data) => {
    const terminal = terminals.get(terminalId);
    if (terminal) {
        terminal.write(data);
    }
});
// Settings IPC Handlers
electron_1.ipcMain.handle('settings-get', async () => {
    return userSettings;
});
electron_1.ipcMain.handle('settings-update', async (_, updates) => {
    userSettings = { ...userSettings, ...updates };
    saveSettings();
    return userSettings;
});
electron_1.ipcMain.handle('settings-reset', async () => {
    userSettings = { ...defaultSettings };
    saveSettings();
    return userSettings;
});
electron_1.ipcMain.handle('settings-add-recent-file', async (_, filePath) => {
    userSettings.recentFiles = [filePath, ...userSettings.recentFiles.filter(f => f !== filePath)].slice(0, 10);
    saveSettings();
    return userSettings;
});
electron_1.ipcMain.handle('settings-add-recent-directory', async (_, dirPath) => {
    userSettings.recentDirectories = [dirPath, ...userSettings.recentDirectories.filter(d => d !== dirPath)].slice(0, 10);
    saveSettings();
    return userSettings;
});
// System Integration IPC Handlers
electron_1.ipcMain.handle('system-open-file', async (_, filePath) => {
    try {
        await electron_1.shell.openPath(filePath);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('system-show-in-folder', async (_, filePath) => {
    try {
        electron_1.shell.showItemInFolder(filePath);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('system-open-url', async (_, url) => {
    try {
        await electron_1.shell.openExternal(url);
        return { success: true };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
electron_1.ipcMain.handle('system-get-info', async () => {
    return {
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        isPackaged: electron_1.app.isPackaged,
        execPath: process.execPath,
        appVersion: electron_1.app.getVersion(),
        userData: electron_1.app.getPath('userData'),
        documents: electron_1.app.getPath('documents'),
        downloads: electron_1.app.getPath('downloads'),
    };
});
// Handle file associations and protocol
const supportedExtensions = ['.pdf', '.docx', '.xlsx', '.pptx', '.html', '.txt', '.md'];
const isSupportedFile = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return supportedExtensions.includes(ext);
};
// Handle files opened with the app
electron_1.app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (isSupportedFile(filePath) && mainWindowRef && !mainWindowRef.isDestroyed()) {
        mainWindowRef.webContents.send('file-opened-with-app', { filePath });
    }
});
// Handle protocol URLs (analystapp://)
electron_1.app.setAsDefaultProtocolClient('analystapp');
electron_1.app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindowRef && !mainWindowRef.isDestroyed()) {
        mainWindowRef.webContents.send('protocol-url-opened', { url });
    }
});
// Handle second instance (Windows/Linux)
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', (_, commandLine) => {
        // Someone tried to run a second instance, focus our window instead
        if (mainWindowRef) {
            if (mainWindowRef.isMinimized())
                mainWindowRef.restore();
            mainWindowRef.focus();
            // Check for file or protocol in command line
            const potentialFile = commandLine.find(arg => isSupportedFile(arg) && fs.existsSync(arg));
            const protocolUrl = commandLine.find(arg => arg.startsWith('analystapp://'));
            if (potentialFile) {
                mainWindowRef.webContents.send('file-opened-with-app', { filePath: potentialFile });
            }
            else if (protocolUrl) {
                mainWindowRef.webContents.send('protocol-url-opened', { url: protocolUrl });
            }
        }
    });
}
electron_1.app.whenReady().then(() => {
    loadSettings();
    createWindow();
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
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
