export interface ElectronAPI {
  ping: () => Promise<string>;

  // File system operations
  selectFolder: () => Promise<any>;
  selectDirectory: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  readDirectory: (path: string) => Promise<Array<{ name: string; path: string; type: 'file' | 'directory' }>>;

  // Terminal operations
  createTerminal: (cwd?: string) => Promise<string>;
  destroyTerminal: (terminalId: string) => Promise<void>;
  writeToTerminal: (terminalId: string, data: string) => Promise<void>;
  onTerminalData: (callback: (data: { terminalId: string; data: string }) => void) => void;

  // Plugin communication
  pluginMessage: (pluginId: string, message: unknown) => Promise<unknown>;
  onPluginEvent: (callback: (event: unknown, ...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}