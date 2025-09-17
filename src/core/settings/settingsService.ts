// This service runs in the renderer process and communicates with main process via IPC

export interface AppSettings {
  // Appearance
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  sidebarCollapsed: boolean;

  // Markdown Converter
  defaultOutputDirectory?: string;
  preserveFileStructure: boolean;
  showConversionProgress: boolean;
  autoOpenOutput: boolean;

  // Terminal
  defaultShell?: string;
  terminalFontSize: number;
  terminalFontFamily: string;
  maxTerminalHistory: number;
  clearTerminalOnStart: boolean;

  // Window
  windowBounds: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  alwaysOnTop: boolean;
  minimizeToTray: boolean;

  // Advanced
  enableDebugMode: boolean;
  maxErrorLogSize: number;
  checkForUpdates: boolean;
  sendUsageStatistics: boolean;

  // Recently used
  recentFiles: string[];
  recentDirectories: string[];
}

export const defaultSettings: AppSettings = {
  // Appearance
  theme: 'system',
  fontSize: 14,
  sidebarCollapsed: false,

  // Markdown Converter
  preserveFileStructure: true,
  showConversionProgress: true,
  autoOpenOutput: false,

  // Terminal
  terminalFontSize: 14,
  terminalFontFamily: 'Monaco, Consolas, "Courier New", monospace',
  maxTerminalHistory: 1000,
  clearTerminalOnStart: false,

  // Window
  windowBounds: {
    width: 1200,
    height: 800,
  },
  alwaysOnTop: false,
  minimizeToTray: false,

  // Advanced
  enableDebugMode: false,
  maxErrorLogSize: 100,
  checkForUpdates: true,
  sendUsageStatistics: false,

  // Recently used
  recentFiles: [],
  recentDirectories: [],
};

export class SettingsService {
  private static instance: SettingsService;
  private settings: AppSettings;

  constructor() {
    this.settings = { ...defaultSettings };
    this.loadSettings();
  }

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  /**
   * Load settings from main process via IPC
   */
  private async loadSettings(): Promise<void> {
    try {
      if (window.electronAPI) {
        const loadedSettings = await window.electronAPI.getSettings();
        this.settings = { ...defaultSettings, ...loadedSettings };
        this.validateSettings();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = { ...defaultSettings };
    }
  }

  /**
   * Validate and sanitize settings
   */
  private validateSettings(): void {
    // Validate theme
    if (!['light', 'dark', 'system'].includes(this.settings.theme)) {
      this.settings.theme = 'system';
    }

    // Validate fontSize
    if (this.settings.fontSize < 10 || this.settings.fontSize > 24) {
      this.settings.fontSize = 14;
    }

    // Validate terminalFontSize
    if (this.settings.terminalFontSize < 8 || this.settings.terminalFontSize > 32) {
      this.settings.terminalFontSize = 14;
    }

    // Validate window bounds
    if (this.settings.windowBounds.width < 600) {
      this.settings.windowBounds.width = 1200;
    }
    if (this.settings.windowBounds.height < 400) {
      this.settings.windowBounds.height = 800;
    }

    // Validate maxErrorLogSize
    if (this.settings.maxErrorLogSize < 10 || this.settings.maxErrorLogSize > 1000) {
      this.settings.maxErrorLogSize = 100;
    }

    // Validate maxTerminalHistory
    if (this.settings.maxTerminalHistory < 100 || this.settings.maxTerminalHistory > 10000) {
      this.settings.maxTerminalHistory = 1000;
    }

    // Validate recent arrays
    if (!Array.isArray(this.settings.recentFiles)) {
      this.settings.recentFiles = [];
    }
    if (!Array.isArray(this.settings.recentDirectories)) {
      this.settings.recentDirectories = [];
    }

    // Limit recent items
    this.settings.recentFiles = this.settings.recentFiles.slice(0, 10);
    this.settings.recentDirectories = this.settings.recentDirectories.slice(0, 10);
  }

  /**
   * Save settings to main process via IPC
   */
  private async saveSettings(): Promise<void> {
    try {
      if (window.electronAPI) {
        await window.electronAPI.updateSettings(this.settings);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Get all settings
   */
  getSettings(): AppSettings {
    return { ...this.settings };
  }

  /**
   * Get a specific setting
   */
  getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.settings[key];
  }

  /**
   * Update a setting
   */
  async updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    this.settings[key] = value;
    this.validateSettings();
    await this.saveSettings();
  }

  /**
   * Update multiple settings at once
   */
  async updateSettings(updates: Partial<AppSettings>): Promise<void> {
    this.settings = { ...this.settings, ...updates };
    this.validateSettings();
    await this.saveSettings();
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(): Promise<void> {
    this.settings = { ...defaultSettings };
    await this.saveSettings();
  }

  /**
   * Add a file to recent files
   */
  async addRecentFile(filePath: string): Promise<void> {
    if (window.electronAPI) {
      const updatedSettings = await window.electronAPI.addRecentFile(filePath);
      this.settings = updatedSettings;
    }
  }

  /**
   * Add a directory to recent directories
   */
  async addRecentDirectory(dirPath: string): Promise<void> {
    if (window.electronAPI) {
      const updatedSettings = await window.electronAPI.addRecentDirectory(dirPath);
      this.settings = updatedSettings;
    }
  }

  /**
   * Remove a file from recent files
   */
  async removeRecentFile(filePath: string): Promise<void> {
    // Remove if already exists
    const filtered = this.settings.recentFiles.filter(f => f !== filePath);
    this.settings.recentFiles = filtered;
    await this.saveSettings();
  }

  /**
   * Remove a directory from recent directories
   */
  async removeRecentDirectory(dirPath: string): Promise<void> {
    // Remove if already exists
    const filtered = this.settings.recentDirectories.filter(d => d !== dirPath);
    this.settings.recentDirectories = filtered;
    await this.saveSettings();
  }

  /**
   * Export settings to file
   */
  async exportSettings(exportPath: string): Promise<void> {
    // This would be handled by the main process
    console.log('Export settings to:', exportPath);
    // Implementation would be added when file dialogs are integrated
  }

  /**
   * Import settings from file
   */
  async importSettings(importPath: string): Promise<void> {
    // This would be handled by the main process
    console.log('Import settings from:', importPath);
    // Implementation would be added when file dialogs are integrated
  }
}

// Export singleton instance
export const settingsService = SettingsService.getInstance();