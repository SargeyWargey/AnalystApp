export interface AppError {
  code: string;
  message: string;
  details?: string;
  timestamp: Date;
  context?: Record<string, any>;
}

export enum ErrorCode {
  // File Operations
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  FILE_WRITE_ERROR = 'FILE_WRITE_ERROR',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',

  // Conversion Errors
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  PYTHON_PROCESS_ERROR = 'PYTHON_PROCESS_ERROR',
  INVALID_OUTPUT_PATH = 'INVALID_OUTPUT_PATH',

  // Terminal Errors
  TERMINAL_SPAWN_ERROR = 'TERMINAL_SPAWN_ERROR',
  TERMINAL_WRITE_ERROR = 'TERMINAL_WRITE_ERROR',
  DIRECTORY_ACCESS_ERROR = 'DIRECTORY_ACCESS_ERROR',

  // System Errors
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  MEMORY_ERROR = 'MEMORY_ERROR',

  // UI Errors
  COMPONENT_ERROR = 'COMPONENT_ERROR',
  STATE_ERROR = 'STATE_ERROR',

  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class AppErrorHandler {
  private static instance: AppErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  static getInstance(): AppErrorHandler {
    if (!AppErrorHandler.instance) {
      AppErrorHandler.instance = new AppErrorHandler();
    }
    return AppErrorHandler.instance;
  }

  createError(
    code: ErrorCode,
    message: string,
    details?: string,
    context?: Record<string, any>
  ): AppError {
    const error: AppError = {
      code,
      message,
      details,
      timestamp: new Date(),
      context
    };

    this.logError(error);
    return error;
  }

  private logError(error: AppError): void {
    this.errorLog.unshift(error);

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console for development
    console.error(`[${error.code}] ${error.message}`, {
      details: error.details,
      context: error.context,
      timestamp: error.timestamp
    });
  }

  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  clearErrorLog(): void {
    this.errorLog = [];
  }

  handleAsyncError<T>(
    promise: Promise<T>,
    errorCode: ErrorCode,
    contextMessage: string
  ): Promise<T> {
    return promise.catch((error) => {
      const appError = this.createError(
        errorCode,
        `${contextMessage}: ${error.message}`,
        error.stack,
        { originalError: error.toString() }
      );
      throw appError;
    });
  }

  wrapFunction<T extends (...args: any[]) => any>(
    fn: T,
    errorCode: ErrorCode,
    contextMessage: string
  ): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);

        // Handle async functions
        if (result instanceof Promise) {
          return this.handleAsyncError(result, errorCode, contextMessage);
        }

        return result;
      } catch (error: any) {
        const appError = this.createError(
          errorCode,
          `${contextMessage}: ${error.message}`,
          error.stack,
          { originalError: error.toString(), args }
        );
        throw appError;
      }
    }) as T;
  }

  getUserFriendlyMessage(error: AppError): string {
    switch (error.code) {
      case ErrorCode.FILE_NOT_FOUND:
        return 'The selected file could not be found. Please check if the file still exists.';
      case ErrorCode.FILE_READ_ERROR:
        return 'Unable to read the file. Please check file permissions.';
      case ErrorCode.FILE_WRITE_ERROR:
        return 'Unable to write to the destination. Please check folder permissions.';
      case ErrorCode.INVALID_FILE_TYPE:
        return 'This file type is not supported for conversion.';
      case ErrorCode.CONVERSION_FAILED:
        return 'File conversion failed. The file may be corrupted or in an unsupported format.';
      case ErrorCode.PYTHON_PROCESS_ERROR:
        return 'Conversion service unavailable. Please restart the application.';
      case ErrorCode.TERMINAL_SPAWN_ERROR:
        return 'Unable to start terminal. Please check system permissions.';
      case ErrorCode.DIRECTORY_ACCESS_ERROR:
        return 'Unable to access the selected directory. Please check permissions.';
      case ErrorCode.PERMISSION_DENIED:
        return 'Permission denied. Please run as administrator or check file permissions.';
      case ErrorCode.MEMORY_ERROR:
        return 'Insufficient memory to complete operation. Please close other applications.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
}

export const errorHandler = AppErrorHandler.getInstance();