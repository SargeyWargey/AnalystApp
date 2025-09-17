import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example IPC methods - will be expanded as we build features
  ping: () => ipcRenderer.invoke('ping'),

  // File system operations
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectory: (path: string) => ipcRenderer.invoke('read-directory', path),

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
})