// Mock converter service for browser development
// In production Electron app, this would be replaced with the real service

export interface ConversionResult {
  success: boolean;
  input_path?: string;
  output_path?: string;
  content_length?: number;
  error?: string;
}

export interface SupportedExtensions {
  success: boolean;
  extensions?: string[];
  error?: string;
}

export class MarkdownConverterService {
  private isElectron = typeof window !== 'undefined' && (window as any).electronAPI;

  /**
   * Get list of supported file extensions
   */
  async getSupportedExtensions(): Promise<SupportedExtensions> {
    if (this.isElectron) {
      try {
        return await (window as any).electronAPI.markdownGetSupportedExtensions();
      } catch (error) {
        console.error('Failed to get supported extensions from Electron:', error);
        return { success: false, error: 'Failed to get supported extensions' };
      }
    }

    // Simulate async operation for browser
    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      success: true,
      extensions: [
        '.pdf', '.docx', '.pptx', '.xlsx', '.doc', '.ppt', '.xls',
        '.html', '.htm', '.csv', '.json', '.xml', '.txt',
        '.zip', '.epub', '.jpg', '.jpeg', '.png', '.bmp', '.gif',
        '.mp3', '.wav', '.m4a', '.flac'
      ]
    };
  }

  /**
   * Convert a file to markdown format
   */
  async convertFile(inputPath: string, outputPath?: string, debugCallback?: (message: string) => void): Promise<ConversionResult> {
    if (this.isElectron) {
      try {
        debugCallback?.('Using Electron IPC for conversion');
        debugCallback?.(`Input: ${inputPath}`);
        debugCallback?.(`Output: ${outputPath || 'auto-generated'}`);

        console.log('Using Electron IPC for conversion:', inputPath, outputPath);
        const result = await (window as any).electronAPI.markdownConvertFile(inputPath, outputPath);

        if (result.success) {
          debugCallback?.('Conversion completed successfully');
          debugCallback?.(`Output file: ${result.output_path}`);
          debugCallback?.(`Content length: ${result.content_length} characters`);
        } else {
          debugCallback?.(`Conversion failed: ${result.error}`);
        }

        return result;
      } catch (error) {
        const errorMsg = 'Failed to convert file via Electron: ' + (error as Error).message;
        debugCallback?.(`Exception: ${errorMsg}`);
        console.error('Failed to convert file via Electron:', error);
        return { success: false, error: errorMsg };
      }
    }

    // Mock implementation for browser
    debugCallback?.('Running in browser mode (mock conversion)');
    debugCallback?.(`Starting mock conversion for: ${inputPath}`);

    const delay = 1000 + Math.random() * 2000;
    debugCallback?.(`Simulating conversion delay: ${Math.round(delay)}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      const errorMsg = 'Mock conversion failed - this is just for testing the error handling';
      debugCallback?.(`Mock failure: ${errorMsg}`);
      return {
        success: false,
        error: errorMsg
      };
    }

    const actualOutputPath = outputPath || inputPath.replace(/\.[^/.]+$/, '.md');
    const contentLength = Math.floor(Math.random() * 5000) + 500;

    debugCallback?.('Mock conversion completed successfully');
    debugCallback?.(`Mock output path: ${actualOutputPath}`);
    debugCallback?.(`Mock content length: ${contentLength} characters`);

    return {
      success: true,
      input_path: inputPath,
      output_path: actualOutputPath,
      content_length: contentLength
    };
  }

  /**
   * Check if a file extension is supported
   */
  async isFileSupported(filePath: string): Promise<boolean> {
    const extensions = await this.getSupportedExtensions();
    if (!extensions.success || !extensions.extensions) {
      return false;
    }

    const fileExtension = filePath.split('.').pop()?.toLowerCase();
    if (!fileExtension) return false;

    return extensions.extensions.includes('.' + fileExtension);
  }

  /**
   * Generate output path for a given input file
   */
  generateOutputPath(inputPath: string, outputDir?: string): string {
    const fileName = inputPath.split('/').pop()?.split('\\').pop() || 'converted';
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const outputFileName = `${baseName}.md`;

    if (outputDir) {
      return `${outputDir}/${outputFileName}`;
    }

    const inputDir = inputPath.substring(0, inputPath.lastIndexOf('/')) ||
                     inputPath.substring(0, inputPath.lastIndexOf('\\')) ||
                     '.';
    return `${inputDir}/${outputFileName}`;
  }
}

// Export singleton instance
export const markdownConverter = new MarkdownConverterService();