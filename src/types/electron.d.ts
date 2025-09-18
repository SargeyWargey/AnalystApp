export interface ElectronAPI {
  ping: () => Promise<string>;

  // File system operations
  selectFolder: () => Promise<any>;
  selectDirectory: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  selectFiles: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  readDirectory: (path: string) => Promise<Array<{ name: string; path: string; type: 'file' | 'directory' }>>;
  readFile: (path: string) => Promise<string>;
  getFileStats: (path: string) => Promise<{ size: number; isFile: boolean; isDirectory: boolean; modified: Date; created: Date }>;

  // Terminal operations
  createTerminal: (cwd?: string) => Promise<{
    success: boolean;
    terminalId?: string;
    workingDirectory?: string;
    error?: string;
    code?: string;
  }>;
  destroyTerminal: (terminalId: string) => Promise<void>;
  writeToTerminal: (terminalId: string, data: string) => Promise<void>;
  onTerminalData: (callback: (data: { terminalId: string; data: string }) => void) => void;
  onTerminalClosed: (callback: (data: any) => void) => void;

  // Plugin communication
  pluginMessage: (pluginId: string, message: unknown) => Promise<unknown>;
  onPluginEvent: (callback: (event: unknown, ...args: unknown[]) => void) => void;

  // Settings
  getSettings: () => Promise<any>;
  updateSettings: (updates: any) => Promise<any>;
  resetSettings: () => Promise<any>;
  addRecentFile: (filePath: string) => Promise<any>;
  addRecentDirectory: (dirPath: string) => Promise<any>;

  // Menu events
  onMenuEvent: (callback: (event: string, data?: any) => void) => void;

  // System integration
  systemOpenFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  systemShowInFolder: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  systemOpenUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
  systemGetInfo: () => Promise<any>;
  onFileOpenedWithApp: (callback: (data: any) => void) => void;
  onProtocolUrlOpened: (callback: (data: any) => void) => void;

  // Markdown conversion operations
  markdownGetSupportedExtensions: () => Promise<{ success: boolean; extensions?: string[]; error?: string }>;
  markdownConvertFile: (inputPath: string, outputPath?: string) => Promise<{ success: boolean; input_path?: string; output_path?: string; content_length?: number; error?: string }>;
  markdownIsFileSupported: (filePath: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}