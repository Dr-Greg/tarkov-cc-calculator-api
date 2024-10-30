import "@std/dotenv/load";
import { type LevelName, LogLevels } from "@std/log";

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

function parseConf() {
  try {
    const logLevel = (Deno.env.get("LOG_LEVEL") || "").trim()
      .toUpperCase();
    const logFilePath = Deno.env.get("LOG_FILE_PATH") || "./logs/app.log";
    const port = Number(Deno.env.get("PORT")) || 8042;
    const mongoConnectionUri = Deno.env.get("MONGO_CONNECTION_URI");

    if (!mongoConnectionUri) {
      throw new ConfigError(
        "Missing MONGO_CONNECTION_URI in environment variables.",
      );
    }

    return {
      db: {
        mongoConnectionUri,
      },
      server: {
        port,
        logLevel: (Object.keys(LogLevels).includes(logLevel!)
          ? logLevel
          : "DEBUG") as LevelName,
        logFilePath,
      },
    };
  } catch (err) {
    console.error(err);
    Deno.exit(1);
  }
}

const config = parseConf();

export { config };
