// This service runs in the renderer process and communicates with main process via IPC

/**
 * System Integration Service
 * Handles file associations, protocol handlers, and system integration
 */
export class SystemIntegrationService {
  private static instance: SystemIntegrationService;
  private supportedExtensions = [
    '.pdf', '.docx', '.xlsx', '.pptx', '.doc', '.xls', '.ppt',
    '.html', '.htm', '.txt', '.md', '.csv', '.json', '.xml'
  ];

  static getInstance(): SystemIntegrationService {
    if (!SystemIntegrationService.instance) {
      SystemIntegrationService.instance = new SystemIntegrationService();
    }
    return SystemIntegrationService.instance;
  }

  /**
   * Initialize system integration features
   */
  async initialize(): Promise<void> {
    try {
      this.setupEventListeners();
      console.log('System integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize system integration:', error);
    }
  }

  /**
   * Setup event listeners for system integration events
   */
  private setupEventListeners(): void {
    if (window.electronAPI) {
      // Listen for files opened with the app
      window.electronAPI.onFileOpenedWithApp((data) => {
        this.handleFileOpened(data.filePath);
      });

      // Listen for protocol URLs
      window.electronAPI.onProtocolUrlOpened((data) => {
        this.handleProtocolUrl(data.url);
      });
    }
  }

  /**
   * Handle custom protocol URLs
   */
  private handleProtocolUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      const action = urlObj.pathname.substring(1); // Remove leading /

      switch (action) {
        case 'convert':
          const filePath = urlObj.searchParams.get('file');
          if (filePath) {
            // Trigger file import and conversion
            this.handleFileOpened(filePath);
          }
          break;

        case 'open':
          const openPath = urlObj.searchParams.get('path');
          if (openPath) {
            console.log('Open path:', openPath);
            // Handle path opening
          }
          break;

        default:
          console.log('Unknown protocol action:', action);
      }
    } catch (error) {
      console.error('Error handling protocol URL:', error);
    }
  }

  /**
   * Handle file opened with the application
   */
  private handleFileOpened(filePath: string): void {
    if (this.isSupportedFile(filePath)) {
      // Dispatch event to application
      window.dispatchEvent(new CustomEvent('file-opened-with-app', {
        detail: { filePath }
      }));
    }
  }

  /**
   * Check if a file is supported for conversion
   */
  private isSupportedFile(filePath: string): boolean {
    const ext = this.getFileExtension(filePath);
    return this.supportedExtensions.includes(ext);
  }

  /**
   * Get file extension from path (simple implementation)
   */
  private getFileExtension(filePath: string): string {
    const lastDot = filePath.lastIndexOf('.');
    return lastDot > -1 ? filePath.substring(lastDot).toLowerCase() : '';
  }

  /**
   * Open file in system default application
   */
  async openFileInSystem(filePath: string): Promise<boolean> {
    if (window.electronAPI) {
      const result = await window.electronAPI.systemOpenFile(filePath);
      return result.success;
    }
    return false;
  }

  /**
   * Show file in system file explorer
   */
  async showFileInExplorer(filePath: string): Promise<boolean> {
    if (window.electronAPI) {
      const result = await window.electronAPI.systemShowInFolder(filePath);
      return result.success;
    }
    return false;
  }

  /**
   * Open URL in system default browser
   */
  async openUrlInBrowser(url: string): Promise<boolean> {
    if (window.electronAPI) {
      const result = await window.electronAPI.systemOpenUrl(url);
      return result.success;
    }
    return false;
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<any> {
    if (window.electronAPI) {
      return await window.electronAPI.systemGetInfo();
    }
    return null;
  }

}

// Export singleton instance
export const systemIntegration = SystemIntegrationService.getInstance();