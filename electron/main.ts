import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import * as pty from 'node-pty'

const isDev = process.env.NODE_ENV === 'development'

// Terminal management
const terminals = new Map<string, pty.IPty>()
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
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
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

ipcMain.handle('read-directory', async (_, dirPath: string) => {
  try {
    const items = await fs.promises.readdir(dirPath, { withFileTypes: true })
    return items.map((item) => ({
      name: item.name,
      path: path.join(dirPath, item.name),
      type: item.isDirectory() ? 'directory' : 'file',
    }))
  } catch (error) {
    console.error('Error reading directory:', error)
    throw error
  }
})

// Terminal IPC Handlers
ipcMain.handle('create-terminal', async (_, cwd?: string) => {
  const terminalId = `terminal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Determine the best shell and arguments
  let shell: string
  let args: string[] = []

  if (process.platform === 'win32') {
    shell = 'powershell.exe'
    args = ['-NoExit', '-Command', '& {',
      'Write-Host "Claude Code Terminal Ready!" -ForegroundColor Green;',
      'Write-Host "Available commands: claude, git, npm, node" -ForegroundColor Yellow;',
      'if (Get-Command claude -ErrorAction SilentlyContinue) { Write-Host "✓ Claude Code detected" -ForegroundColor Green } else { Write-Host "! Claude Code not found in PATH" -ForegroundColor Red }',
      '}'
    ]
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
    cwd: cwd || process.env.HOME || process.env.USERPROFILE,
    env: {
      ...process.env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
    },
  })

  terminal.onData((data) => {
    if (mainWindowRef && !mainWindowRef.isDestroyed()) {
      mainWindowRef.webContents.send('terminal-data', {
        terminalId,
        data,
      })
    }
  })

  terminal.onExit(() => {
    terminals.delete(terminalId)
  })

  // Send welcome message for Unix systems
  if (process.platform !== 'win32') {
    setTimeout(() => {
      terminal.write('\r\n\x1b[32mClaude Code Terminal Ready!\x1b[0m\r\n')
      terminal.write('\x1b[33mAvailable commands: claude, git, npm, node\x1b[0m\r\n')
      terminal.write('which claude > /dev/null 2>&1 && echo "\\x1b[32m✓ Claude Code detected\\x1b[0m" || echo "\\x1b[31m! Claude Code not found in PATH\\x1b[0m"\r\n')
    }, 500)
  }

  terminals.set(terminalId, terminal)
  return terminalId
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

app.whenReady().then(() => {
  createWindow()

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