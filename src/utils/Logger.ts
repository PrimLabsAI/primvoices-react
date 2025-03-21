export class Logger {
  protected readonly LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
  };

  protected readonly DEFAULT_LOG_LEVEL = this.LOG_LEVELS.INFO;
  protected logLevel = this.DEFAULT_LOG_LEVEL;

  public setLogLevel(level: keyof typeof this.LOG_LEVELS) {
    this.logLevel = this.LOG_LEVELS[level];
  }

  public debug(message: string, ...args: any[]) {
    if (this.logLevel <= this.LOG_LEVELS.DEBUG) {
      console.log(message, ...args);
    }
  }

  public info(message: string, ...args: any[]) {
    if (this.logLevel <= this.LOG_LEVELS.INFO) {
      console.log(message, ...args);
    }
  }
  
  public warn(message: string, ...args: any[]) {
    if (this.logLevel <= this.LOG_LEVELS.WARN) {
      console.warn(message, ...args);
    }
  }

  public error(message: string, ...args: any[]) {
    if (this.logLevel <= this.LOG_LEVELS.ERROR) {
      console.error(message, ...args);
    }
  }  
}
