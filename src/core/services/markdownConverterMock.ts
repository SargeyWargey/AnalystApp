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
  /**
   * Get list of supported file extensions
   */
  async getSupportedExtensions(): Promise<SupportedExtensions> {
    // Simulate async operation
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
   * Convert a file to markdown format (mock implementation)
   */
  async convertFile(inputPath: string, outputPath?: string): Promise<ConversionResult> {
    // Simulate conversion process with realistic timing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: 'Mock conversion failed - this is just for testing the error handling'
      };
    }

    const actualOutputPath = outputPath || inputPath.replace(/\.[^/.]+$/, '.md');

    return {
      success: true,
      input_path: inputPath,
      output_path: actualOutputPath,
      content_length: Math.floor(Math.random() * 5000) + 500
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