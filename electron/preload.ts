import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example IPC methods - will be expanded as we build features
  ping: () => ipcRenderer.invoke('ping'),

  // File system operations
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  readDirectory: (path: string) => ipcRenderer.invoke('read-directory', path),
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  getFileStats: (path: string) => ipcRenderer.invoke('get-file-stats', path),

  // Terminal operations
  createTerminal: (cwd?: string) => ipcRenderer.invoke('create-terminal', cwd),
  destroyTerminal: (terminalId: string) => ipcRenderer.invoke('destroy-terminal', terminalId),
  writeToTerminal: (terminalId: string, data: string) =>
    ipcRenderer.invoke('write-to-terminal', terminalId, data),
  onTerminalData: (callback: (data: any) => void) =>
    ipcRenderer.on('terminal-data', (_, data) => callback(data)),

  // Plugin communication
  pluginMessage: (pluginId: string, message: unknown) =>
    ipcRenderer.invoke('plugin-message', pluginId, message),

  // Listen for plugin events
  onPluginEvent: (callback: (event: unknown, ...args: unknown[]) => void) =>
    ipcRenderer.on('plugin-event', callback),

  // Settings operations
  getSettings: () => ipcRenderer.invoke('settings-get'),
  updateSettings: (updates: any) => ipcRenderer.invoke('settings-update', updates),
  resetSettings: () => ipcRenderer.invoke('settings-reset'),
  addRecentFile: (filePath: string) => ipcRenderer.invoke('settings-add-recent-file', filePath),
  addRecentDirectory: (dirPath: string) => ipcRenderer.invoke('settings-add-recent-directory', dirPath),

  // Menu events
  onMenuEvent: (callback: (event: string, data?: any) => void) => {
    ipcRenderer.on('navigate-to', (_, data) => callback('navigate-to', data));
    ipcRenderer.on('show-shortcuts', () => callback('show-shortcuts'));
    ipcRenderer.on('file-imported', (_, data) => callback('file-imported', data));
    ipcRenderer.on('output-directory-selected', (_, data) => callback('output-directory-selected', data));
    ipcRenderer.on('export-settings', (_, data) => callback('export-settings', data));
    ipcRenderer.on('import-settings', (_, data) => callback('import-settings', data));
    ipcRenderer.on('create-new-terminal', () => callback('create-new-terminal'));
    ipcRenderer.on('close-current-terminal', () => callback('close-current-terminal'));
    ipcRenderer.on('clear-terminal', () => callback('clear-terminal'));
    ipcRenderer.on('reset-terminal', () => callback('reset-terminal'));
    ipcRenderer.on('start-conversion', () => callback('start-conversion'));
    ipcRenderer.on('open-output-folder', () => callback('open-output-folder'));
  },

  // Terminal events
  onTerminalClosed: (callback: (data: any) => void) =>
    ipcRenderer.on('terminal-closed', (_, data) => callback(data)),

  // System integration
  systemOpenFile: (filePath: string) => ipcRenderer.invoke('system-open-file', filePath),
  systemShowInFolder: (filePath: string) => ipcRenderer.invoke('system-show-in-folder', filePath),
  systemOpenUrl: (url: string) => ipcRenderer.invoke('system-open-url', url),
  systemGetInfo: () => ipcRenderer.invoke('system-get-info'),

  // System events
  onFileOpenedWithApp: (callback: (data: any) => void) =>
    ipcRenderer.on('file-opened-with-app', (_, data) => callback(data)),
  onProtocolUrlOpened: (callback: (data: any) => void) =>
    ipcRenderer.on('protocol-url-opened', (_, data) => callback(data)),

  // Markdown conversion operations
  markdownGetSupportedExtensions: () => ipcRenderer.invoke('markdown-get-supported-extensions'),
  markdownConvertFile: (inputPath: string, outputPath?: string) =>
    ipcRenderer.invoke('markdown-convert-file', inputPath, outputPath),
  markdownIsFileSupported: (filePath: string) =>
    ipcRenderer.invoke('markdown-is-file-supported', filePath),
})