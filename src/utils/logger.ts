/* eslint-disable @typescript-eslint/no-explicit-any */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel = LogLevel.INFO;

  setLevel(level: LogLevel) {
    this.level = level;
  }

  debug(message: string, ...args: any[]) {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    if (this.level <= LogLevel.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: Error, ...args: any[]) {
    if (this.level <= LogLevel.ERROR) {
      console.error(`[ERROR] ${message}`, error, ...args);
      
      // Send to error tracking service
      if (typeof window !== 'undefined') {
        // Sentry, Bugsnag, or other error tracking
        // errorTracker.captureException(error, { message, ...args });
      }
    }
  }
}

export const logger = new Logger();

// Set log level based on environment
if (process.env.NODE_ENV === 'development') {
  logger.setLevel(LogLevel.DEBUG);
} else {
  logger.setLevel(LogLevel.WARN);
}