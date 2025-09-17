import { app, Menu, shell, BrowserWindow, dialog } from 'electron';

interface MenuTemplate extends Electron.MenuItemConstructorOptions {
  submenu?: MenuTemplate[];
}

export function createApplicationMenu(mainWindow: BrowserWindow): Menu {
  const isMac = process.platform === 'darwin';

  const template: MenuTemplate[] = [
    // macOS App menu
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        {
          label: 'Preferences...',
          accelerator: 'Cmd+,',
          click: () => {
            mainWindow.webContents.send('navigate-to', 'settings');
          }
        },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const }
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
            const result = await dialog.showOpenDialog(mainWindow, {
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
            const result = await dialog.showOpenDialog(mainWindow, {
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
            const result = await dialog.showSaveDialog(mainWindow, {
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
            const result = await dialog.showOpenDialog(mainWindow, {
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
        ...(isMac ? [] : [{ role: 'quit' as const }])
      ]
    },

    // Edit menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' as const },
          { role: 'delete' as const },
          { role: 'selectAll' as const },
          { type: 'separator' as const },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' as const },
              { role: 'stopSpeaking' as const }
            ]
          }
        ] : [
          { role: 'delete' as const },
          { type: 'separator' as const },
          { role: 'selectAll' as const }
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
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const }
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
            shell.openExternal('https://github.com/your-repo/releases');
          }
        }
      ]
    },

    // Window menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'close' as const },
        ...(isMac ? [
          { type: 'separator' as const },
          { role: 'front' as const },
          { type: 'separator' as const },
          { role: 'window' as const }
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
            shell.openExternal('https://docs.your-app.com');
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
            shell.openExternal('https://github.com/your-repo/issues');
          }
        },
        {
          label: 'Send Feedback',
          click: () => {
            shell.openExternal('mailto:feedback@your-app.com');
          }
        },
        { type: 'separator' },
        ...(!isMac ? [{
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
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

  const menu = Menu.buildFromTemplate(template);
  return menu;
}

export function setupApplicationMenu(mainWindow: BrowserWindow): void {
  const menu = createApplicationMenu(mainWindow);
  Menu.setApplicationMenu(menu);
}