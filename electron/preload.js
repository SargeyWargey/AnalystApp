"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // Example IPC methods - will be expanded as we build features
    ping: () => electron_1.ipcRenderer.invoke('ping'),
    // File system operations
    selectFolder: () => electron_1.ipcRenderer.invoke('select-folder'),
    selectDirectory: () => electron_1.ipcRenderer.invoke('select-directory'),
    readDirectory: (path) => electron_1.ipcRenderer.invoke('read-directory', path),
    // Terminal operations
    createTerminal: (cwd) => electron_1.ipcRenderer.invoke('create-terminal', cwd),
    destroyTerminal: (terminalId) => electron_1.ipcRenderer.invoke('destroy-terminal', terminalId),
    writeToTerminal: (terminalId, data) => electron_1.ipcRenderer.invoke('write-to-terminal', terminalId, data),
    onTerminalData: (callback) => electron_1.ipcRenderer.on('terminal-data', (_, data) => callback(data)),
    // Plugin communication
    pluginMessage: (pluginId, message) => electron_1.ipcRenderer.invoke('plugin-message', pluginId, message),
    // Listen for plugin events
    onPluginEvent: (callback) => electron_1.ipcRenderer.on('plugin-event', callback),
    // Settings operations
    getSettings: () => electron_1.ipcRenderer.invoke('settings-get'),
    updateSettings: (updates) => electron_1.ipcRenderer.invoke('settings-update', updates),
    resetSettings: () => electron_1.ipcRenderer.invoke('settings-reset'),
    addRecentFile: (filePath) => electron_1.ipcRenderer.invoke('settings-add-recent-file', filePath),
    addRecentDirectory: (dirPath) => electron_1.ipcRenderer.invoke('settings-add-recent-directory', dirPath),
    // Menu events
    onMenuEvent: (callback) => {
        electron_1.ipcRenderer.on('navigate-to', (_, data) => callback('navigate-to', data));
        electron_1.ipcRenderer.on('show-shortcuts', () => callback('show-shortcuts'));
        electron_1.ipcRenderer.on('file-imported', (_, data) => callback('file-imported', data));
        electron_1.ipcRenderer.on('output-directory-selected', (_, data) => callback('output-directory-selected', data));
        electron_1.ipcRenderer.on('export-settings', (_, data) => callback('export-settings', data));
        electron_1.ipcRenderer.on('import-settings', (_, data) => callback('import-settings', data));
        electron_1.ipcRenderer.on('create-new-terminal', () => callback('create-new-terminal'));
        electron_1.ipcRenderer.on('close-current-terminal', () => callback('close-current-terminal'));
        electron_1.ipcRenderer.on('clear-terminal', () => callback('clear-terminal'));
        electron_1.ipcRenderer.on('reset-terminal', () => callback('reset-terminal'));
        electron_1.ipcRenderer.on('start-conversion', () => callback('start-conversion'));
        electron_1.ipcRenderer.on('open-output-folder', () => callback('open-output-folder'));
    },
    // Terminal events
    onTerminalClosed: (callback) => electron_1.ipcRenderer.on('terminal-closed', (_, data) => callback(data)),
    // System integration
    systemOpenFile: (filePath) => electron_1.ipcRenderer.invoke('system-open-file', filePath),
    systemShowInFolder: (filePath) => electron_1.ipcRenderer.invoke('system-show-in-folder', filePath),
    systemOpenUrl: (url) => electron_1.ipcRenderer.invoke('system-open-url', url),
    systemGetInfo: () => electron_1.ipcRenderer.invoke('system-get-info'),
    // System events
    onFileOpenedWithApp: (callback) => electron_1.ipcRenderer.on('file-opened-with-app', (_, data) => callback(data)),
    onProtocolUrlOpened: (callback) => electron_1.ipcRenderer.on('protocol-url-opened', (_, data) => callback(data)),
});
