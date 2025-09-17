"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationMenu = createApplicationMenu;
exports.setupApplicationMenu = setupApplicationMenu;
const electron_1 = require("electron");
function createApplicationMenu(mainWindow) {
    const isMac = process.platform === 'darwin';
    const template = [
        // macOS App menu
        ...(isMac ? [{
                label: electron_1.app.getName(),
                submenu: [
                    { role: 'about' },
                    { type: 'separator' },
                    {
                        label: 'Preferences...',
                        accelerator: 'Cmd+,',
                        click: () => {
                            mainWindow.webContents.send('navigate-to', 'settings');
                        }
                    },
                    { type: 'separator' },
                    { role: 'services' },
                    { type: 'separator' },
                    { role: 'hide' },
                    { role: 'hideOthers' },
                    { role: 'unhide' },
                    { type: 'separator' },
                    { role: 'quit' }
                ]
            }] : []),
        // File menu
        {
            label: 'File',
            submenu: [
                {
                    label: 'Import File',
                    accelerator: 'CmdOrCtrl+I',
                    click: async () => {
                        const result = await electron_1.dialog.showOpenDialog(mainWindow, {
                            title: 'Import File for Conversion',
                            properties: ['openFile'],
                            filters: [
                                { name: 'All Supported', extensions: ['pdf', 'docx', 'xlsx', 'pptx', 'html', 'txt', 'md'] },
                                { name: 'PDF Documents', extensions: ['pdf'] },
                                { name: 'Microsoft Office', extensions: ['docx', 'xlsx', 'pptx'] },
                                { name: 'Web Files', extensions: ['html', 'htm'] },
                                { name: 'Text Files', extensions: ['txt', 'md'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });
                        if (!result.canceled && result.filePaths.length > 0) {
                            mainWindow.webContents.send('file-imported', result.filePaths[0]);
                        }
                    }
                },
                {
                    label: 'Select Output Directory',
                    accelerator: 'CmdOrCtrl+Shift+O',
                    click: async () => {
                        const result = await electron_1.dialog.showOpenDialog(mainWindow, {
                            title: 'Select Output Directory',
                            properties: ['openDirectory']
                        });
                        if (!result.canceled && result.filePaths.length > 0) {
                            mainWindow.webContents.send('output-directory-selected', result.filePaths[0]);
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Export Settings',
                    click: async () => {
                        const result = await electron_1.dialog.showSaveDialog(mainWindow, {
                            title: 'Export Settings',
                            defaultPath: 'analystapp-settings.json',
                            filters: [
                                { name: 'JSON Files', extensions: ['json'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });
                        if (!result.canceled && result.filePath) {
                            mainWindow.webContents.send('export-settings', result.filePath);
                        }
                    }
                },
                {
                    label: 'Import Settings',
                    click: async () => {
                        const result = await electron_1.dialog.showOpenDialog(mainWindow, {
                            title: 'Import Settings',
                            properties: ['openFile'],
                            filters: [
                                { name: 'JSON Files', extensions: ['json'] },
                                { name: 'All Files', extensions: ['*'] }
                            ]
                        });
                        if (!result.canceled && result.filePaths.length > 0) {
                            mainWindow.webContents.send('import-settings', result.filePaths[0]);
                        }
                    }
                },
                { type: 'separator' },
                ...(isMac ? [] : [{ role: 'quit' }])
            ]
        },
        // Edit menu
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac ? [
                    { role: 'pasteAndMatchStyle' },
                    { role: 'delete' },
                    { role: 'selectAll' },
                    { type: 'separator' },
                    {
                        label: 'Speech',
                        submenu: [
                            { role: 'startSpeaking' },
                            { role: 'stopSpeaking' }
                        ]
                    }
                ] : [
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' }
                ])
            ]
        },
        // View menu
        {
            label: 'View',
            submenu: [
                {
                    label: 'Markdown Converter',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', 'markdown');
                    }
                },
                {
                    label: 'Terminal',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', 'terminal');
                    }
                },
                {
                    label: 'Settings',
                    accelerator: 'CmdOrCtrl+3',
                    click: () => {
                        mainWindow.webContents.send('navigate-to', 'settings');
                    }
                },
                { type: 'separator' },
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        // Terminal menu
        {
            label: 'Terminal',
            submenu: [
                {
                    label: 'New Terminal',
                    accelerator: 'CmdOrCtrl+T',
                    click: () => {
                        mainWindow.webContents.send('create-new-terminal');
                    }
                },
                {
                    label: 'Close Terminal',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => {
                        mainWindow.webContents.send('close-current-terminal');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Clear Terminal',
                    accelerator: 'CmdOrCtrl+K',
                    click: () => {
                        mainWindow.webContents.send('clear-terminal');
                    }
                },
                {
                    label: 'Reset Terminal',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.webContents.send('reset-terminal');
                    }
                }
            ]
        },
        // Tools menu
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Convert Current File',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        mainWindow.webContents.send('start-conversion');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Output Folder',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        mainWindow.webContents.send('open-output-folder');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Check for Updates',
                    click: () => {
                        electron_1.shell.openExternal('https://github.com/your-repo/releases');
                    }
                }
            ]
        },
        // Window menu
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front' },
                    { type: 'separator' },
                    { role: 'window' }
                ] : [])
            ]
        },
        // Help menu
        {
            role: 'help',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => {
                        electron_1.shell.openExternal('https://docs.your-app.com');
                    }
                },
                {
                    label: 'Keyboard Shortcuts',
                    accelerator: 'CmdOrCtrl+/',
                    click: () => {
                        mainWindow.webContents.send('show-shortcuts');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Report Issue',
                    click: () => {
                        electron_1.shell.openExternal('https://github.com/your-repo/issues');
                    }
                },
                {
                    label: 'Send Feedback',
                    click: () => {
                        electron_1.shell.openExternal('mailto:feedback@your-app.com');
                    }
                },
                { type: 'separator' },
                ...(!isMac ? [{
                        label: 'About',
                        click: () => {
                            electron_1.dialog.showMessageBox(mainWindow, {
                                type: 'info',
                                title: 'About AnalystApp',
                                message: 'AnalystApp v1.0.0',
                                detail: 'A cross-platform productivity application with MarkDown conversion and integrated terminal features.\n\nBuilt with Electron + React + TypeScript'
                            });
                        }
                    }] : [])
            ]
        }
    ];
    const menu = electron_1.Menu.buildFromTemplate(template);
    return menu;
}
function setupApplicationMenu(mainWindow) {
    const menu = createApplicationMenu(mainWindow);
    electron_1.Menu.setApplicationMenu(menu);
}
