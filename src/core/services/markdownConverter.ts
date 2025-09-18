import { spawn } from 'child_process';
import * as path from 'path';
import { errorHandler, ErrorCode } from '../error/errorHandler';
import * as fs from 'fs';

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
    return (await errorHandler.handleAsyncError(
      new Promise((resolve, reject) => {
        // Check if Python script exists
        if (!fs.existsSync(this.pythonScript)) {
          const error = errorHandler.createError(
            ErrorCode.FILE_NOT_FOUND,
            'Python conversion script not found',
            `Script path: ${this.pythonScript}`,
            { scriptPath: this.pythonScript }
          );
          reject(error);
          return;
        }

        const python = spawn('/opt/homebrew/bin/python3.11', [this.pythonScript, 'supported'], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        python.stderr.on('data', (data) => {
          stderr += data.toString();
          console.log('Python stderr:', data.toString());
        });

        python.on('close', (code) => {
          try {
            if (code === 0) {
              const result = JSON.parse(stdout.trim());
              resolve(result);
            } else {
              const error = errorHandler.createError(
                ErrorCode.PYTHON_PROCESS_ERROR,
                'Python script execution failed',
                `Exit code: ${code}, stderr: ${stderr}`,
                { exitCode: code, stderr, stdout }
              );
              reject(error);
            }
          } catch (parseError: any) {
            const error = errorHandler.createError(
              ErrorCode.PYTHON_PROCESS_ERROR,
              'Failed to parse Python script output',
              parseError.message,
              { stdout, stderr, parseError: parseError.toString() }
            );
            reject(error);
          }
        });

        python.on('error', (spawnError) => {
          const error = errorHandler.createError(
            ErrorCode.PYTHON_PROCESS_ERROR,
            'Failed to spawn Python process',
            spawnError.message,
            { originalError: spawnError.toString() }
          );
          reject(error);
        });
      }),
      ErrorCode.PYTHON_PROCESS_ERROR,
      'Getting supported extensions'
    ).catch((error) => {
      // Convert thrown AppError back to the expected format
      return {
        success: false,
        error: error.message || 'Failed to get supported extensions'
      };
    })) as SupportedExtensions;
  }

  /**
   * Convert a file to markdown format
   */
  async convertFile(inputPath: string, outputPath?: string, debugCallback?: (message: string) => void): Promise<ConversionResult> {
    return (await errorHandler.handleAsyncError(
      new Promise((resolve, reject) => {
        debugCallback?.('Validating input file');
        debugCallback?.(`Input path: ${inputPath}`);

        // Validate input file exists
        if (!fs.existsSync(inputPath)) {
          debugCallback?.('Input file does not exist');
          const error = errorHandler.createError(
            ErrorCode.FILE_NOT_FOUND,
            'Input file not found',
            `File path: ${inputPath}`,
            { inputPath }
          );
          reject(error);
          return;
        }

        debugCallback?.('Input file exists, proceeding with validation');

        // Validate output directory exists if outputPath is provided
        if (outputPath) {
          debugCallback?.(`Validating output directory: ${outputPath}`);
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            debugCallback?.(`Output directory does not exist: ${outputDir}`);
            const error = errorHandler.createError(
              ErrorCode.INVALID_OUTPUT_PATH,
              'Output directory does not exist',
              `Directory path: ${outputDir}`,
              { outputPath, outputDir }
            );
            reject(error);
            return;
          }
          debugCallback?.('Output directory validation passed');

          // Check write permissions on output directory
          try {
            fs.accessSync(outputDir, fs.constants.W_OK);
          } catch (accessError: any) {
            const error = errorHandler.createError(
              ErrorCode.PERMISSION_DENIED,
              'No write permission for output directory',
              accessError.message,
              { outputDir, originalError: accessError.toString() }
            );
            reject(error);
            return;
          }
        }

        // Check if Python script exists
        if (!fs.existsSync(this.pythonScript)) {
          const error = errorHandler.createError(
            ErrorCode.FILE_NOT_FOUND,
            'Python conversion script not found',
            `Script path: ${this.pythonScript}`,
            { scriptPath: this.pythonScript }
          );
          reject(error);
          return;
        }

        const args = ['convert', inputPath];
        if (outputPath) {
          args.push(outputPath);
        }

        debugCallback?.(`Starting Python conversion with args: ${args.join(' ')}`);
        debugCallback?.(`Using Python: /opt/homebrew/bin/python3.11`);
        debugCallback?.(`Script: ${this.pythonScript}`);

        console.log('Starting Python conversion with args:', [this.pythonScript, ...args]);
        const python = spawn('/opt/homebrew/bin/python3.11', [this.pythonScript, ...args], {
          stdio: ['pipe', 'pipe', 'pipe']
        });

        debugCallback?.('Python process spawned, waiting for completion');

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (data) => {
          stdout += data.toString();
          debugCallback?.(`Python stdout: ${data.toString().trim()}`);
        });

        python.stderr.on('data', (data) => {
          const stderrText = data.toString();
          stderr += stderrText;
          console.log('Python stderr:', stderrText);
          debugCallback?.(`Python stderr: ${stderrText.trim()}`);
        });

        python.on('close', (code) => {
          debugCallback?.(`Python process exited with code: ${code}`);
          try {
            if (code === 0) {
              debugCallback?.('Python conversion successful, parsing result');
              const result = JSON.parse(stdout.trim());
              debugCallback?.(`Conversion completed: ${result.output_path || 'Unknown output'}`);
              resolve(result);
            } else {
              debugCallback?.(`Python process failed with exit code ${code}`);
              debugCallback?.(`stderr: ${stderr}`);
              const error = errorHandler.createError(
                ErrorCode.CONVERSION_FAILED,
                'File conversion failed',
                `Exit code: ${code}, stderr: ${stderr}`,
                { inputPath, outputPath, exitCode: code, stderr, stdout }
              );
              reject(error);
            }
          } catch (parseError: any) {
            debugCallback?.(`Failed to parse Python result: ${parseError.message}`);
            debugCallback?.(`stdout: ${stdout}`);
            const error = errorHandler.createError(
              ErrorCode.CONVERSION_FAILED,
              'Failed to parse conversion result',
              parseError.message,
              { inputPath, outputPath, stdout, stderr, parseError: parseError.toString() }
            );
            reject(error);
          }
        });

        python.on('error', (spawnError) => {
          debugCallback?.(`Failed to spawn Python process: ${spawnError.message}`);
          const error = errorHandler.createError(
            ErrorCode.PYTHON_PROCESS_ERROR,
            'Failed to spawn Python conversion process',
            spawnError.message,
            { inputPath, outputPath, originalError: spawnError.toString() }
          );
          reject(error);
        });
      }),
      ErrorCode.CONVERSION_FAILED,
      'Converting file to markdown'
    ).catch((error) => {
      // Convert thrown AppError back to the expected format
      return {
        success: false,
        error: error.message || 'File conversion failed'
      };
    })) as ConversionResult;
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