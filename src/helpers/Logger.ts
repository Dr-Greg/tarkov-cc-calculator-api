import * as log from "@std/log";
import { config } from "../config.ts";

type LoggerMethod = "debug" | "info" | "warn" | "error" | "critical";

class LoggerMessage {
    private readonly message: string;
    private method: LoggerMethod;

    constructor(message: string, method: LoggerMethod) {
        this.message = message;
        this.method = method;
    }

    write() {
        log.getLogger("file")[this.method](this.message);
    }
}

class Logger {
    constructor(logLevel: log.LevelName, filePath: string) {
        log.setup({
            handlers: {
                console: new log.ConsoleHandler(logLevel, {
                    formatter: (record) => {
                        const timestamp = new Date().toISOString();
                        return `[${record.levelName}] - ${timestamp} : ${record.msg}`;
                    },
                }),
                file: new log.FileHandler(logLevel, {
                    filename: filePath,
                    formatter: (record) => {
                        const timestamp = new Date().toISOString();
                        return `[${record.levelName}] - ${timestamp} : ${record.msg}`;
                    },
                }),
            },
            loggers: {
                console: {
                    handlers: ["console"],
                },
                file: {
                    handlers: ["file"],
                },
            },
        });
    }

    private formatData(data?: unknown): string {
        if (!data) {
            return "";
        }

        if (data instanceof Error) {
            return `\n  - ${data.name}: ${data.message}\nStack: ${data.stack}`;
        } else if (typeof data === "object") {
            return "\n" + JSON.stringify(data, null, 2);
        } else {
            return "\n  - " + String(data);
        }
    }

    debug(msg: string, data?: unknown) {
        log.getLogger("console").debug(msg + this.formatData(data));
        return new LoggerMessage(msg, "debug");
    }

    info(msg: string, data?: unknown) {
        log.getLogger("console").info(msg + this.formatData(data));
        return new LoggerMessage(msg, "info");
    }

    warn(msg: string, data?: unknown) {
        log.getLogger("console").warn(msg + this.formatData(data));
        return new LoggerMessage(msg, "warn");
    }

    error(msg: string, data?: unknown) {
        log.getLogger("console").error(msg + this.formatData(data));
        return new LoggerMessage(msg, "error");
    }

    critical(msg: string, data?: unknown) {
        log.getLogger("console").critical(msg + this.formatData(data));
        return new LoggerMessage(msg, "critical");
    }
}

export default new Logger(config.server.logLevel, config.server.logFilePath);
