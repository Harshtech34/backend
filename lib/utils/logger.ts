type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 1000

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    // Add to in-memory logs (with limit)
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      const contextStr = context ? ` ${JSON.stringify(context)}` : ""
      console[level](`[${logEntry.timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`)
    }
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log("debug", message, context)
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log("info", message, context)
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log("warn", message, context)
  }

  public error(message: string, context?: Record<string, any>): void {
    this.log("error", message, context)
  }

  public getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filteredLogs = this.logs

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level)
    }

    return filteredLogs.slice(-limit)
  }

  public clearLogs(): void {
    this.logs = []
  }
}

export const logger = Logger.getInstance()
