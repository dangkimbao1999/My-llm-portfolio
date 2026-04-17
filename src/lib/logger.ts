import { env } from "@/config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

function shouldLog(level: LogLevel) {
  if (level === "debug" && !env.ENABLE_VERBOSE_LOGS) {
    return false;
  }

  return true;
}

function write(level: LogLevel, message: string, meta?: unknown) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = meta ? { message, meta } : { message };
  console[level](`[${level.toUpperCase()}]`, payload);
}

export const logger = {
  debug: (message: string, meta?: unknown) => write("debug", message, meta),
  info: (message: string, meta?: unknown) => write("info", message, meta),
  warn: (message: string, meta?: unknown) => write("warn", message, meta),
  error: (message: string, meta?: unknown) => write("error", message, meta),
};

