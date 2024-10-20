import "@std/dotenv/load";

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

function parseConf() {
  try {
    const mongoConnectionUri = Deno.env.get("MONGO_CONNECTION_URI");

    const port = Number(Deno.env.get("PORT")) || 8042;

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
      },
    };
  } catch (err) {
    console.error(err);
    Deno.exit(1);
  }
}

const config = parseConf();

export { config };
