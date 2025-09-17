import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example IPC methods - will be expanded as we build features
  ping: () => ipcRenderer.invoke('ping'),

  // File system operations
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  // Plugin communication
  pluginMessage: (pluginId: string, message: unknown) =>
    ipcRenderer.invoke('plugin-message', pluginId, message),

  // Listen for plugin events
  onPluginEvent: (callback: (event: unknown, ...args: unknown[]) => void) =>
    ipcRenderer.on('plugin-event', callback),
})