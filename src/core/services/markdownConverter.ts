import { spawn } from 'child_process';
import path from 'path';

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
  private pythonScript: string;

  constructor() {
    // Path to our Python conversion script
    this.pythonScript = path.join(process.cwd(), 'scripts', 'markdown_converter.py');
  }

  /**
   * Get list of supported file extensions
   */
  async getSupportedExtensions(): Promise<SupportedExtensions> {
    return new Promise((resolve) => {
      const python = spawn('python', [this.pythonScript, 'supported'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        try {
          if (code === 0) {
            const result = JSON.parse(stdout.trim());
            resolve(result);
          } else {
            resolve({
              success: false,
              error: `Python script failed with code ${code}: ${stderr}`
            });
          }
        } catch (error) {
          resolve({
            success: false,
            error: `Failed to parse Python script output: ${error}`
          });
        }
      });

      python.on('error', (error) => {
        resolve({
          success: false,
          error: `Failed to spawn Python process: ${error.message}`
        });
      });
    });
  }

  /**
   * Convert a file to markdown format
   */
  async convertFile(inputPath: string, outputPath?: string): Promise<ConversionResult> {
    return new Promise((resolve) => {
      const args = ['convert', inputPath];
      if (outputPath) {
        args.push(outputPath);
      }

      const python = spawn('python', [this.pythonScript, ...args], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        try {
          if (code === 0) {
            const result = JSON.parse(stdout.trim());
            resolve(result);
          } else {
            resolve({
              success: false,
              error: `Python script failed with code ${code}: ${stderr}`
            });
          }
        } catch (error) {
          resolve({
            success: false,
            error: `Failed to parse Python script output: ${error}`
          });
        }
      });

      python.on('error', (error) => {
        resolve({
          success: false,
          error: `Failed to spawn Python process: ${error.message}`
        });
      });
    });
  }

  /**
   * Check if a file extension is supported
   */
  async isFileSupported(filePath: string): Promise<boolean> {
    const extensions = await this.getSupportedExtensions();
    if (!extensions.success || !extensions.extensions) {
      return false;
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    return extensions.extensions.includes(fileExtension);
  }

  /**
   * Generate output path for a given input file
   */
  generateOutputPath(inputPath: string, outputDir?: string): string {
    const inputFile = path.parse(inputPath);
    const outputFileName = `${inputFile.name}.md`;

    if (outputDir) {
      return path.join(outputDir, outputFileName);
    }

    return path.join(inputFile.dir, outputFileName);
  }
}

// Export singleton instance
export const markdownConverter = new MarkdownConverterService();