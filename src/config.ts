import "@std/dotenv/load";

class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

function parseConf() {
  try {
    const username = Deno.env.get("MONGO_USERNAME");
    const password = Deno.env.get("MONGO_PASSWORD");
    const host = Deno.env.get("MONGO_HOST");
    const database = Deno.env.get("MONGO_DATABASE");

    const port = Number(Deno.env.get("PORT")) || 8042;

    if (!username)
      throw new ConfigError("Missing MONGO_USERNAME in environment variables.");
    if (!password)
      throw new ConfigError("Missing MONGO_PASSWORD in environment variables.");
    if (!host)
      throw new ConfigError("Missing MONGO_HOST in environment variables.");
    if (!database)
      throw new ConfigError("Missing MONGO_DATABASE in environment variables.");

    const encodedPassword = encodeURIComponent(password);

    return {
      db: {
        username,
        encodedPassword,
        host,
        database,
      },
      server: {
        port
      }
    };
  } catch (err) {
    console.error(err);
    Deno.exit(1);
  }
}

const config = parseConf();

export { config };
