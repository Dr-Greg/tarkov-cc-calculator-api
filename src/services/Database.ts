import { Collection, Database, type Document, MongoClient } from "@db/mongo";
import { config } from "../config.ts";
import Logger from "../helpers/Logger.ts";

class DatabaseService {
  private client: MongoClient = new MongoClient();
  private db!: Database;

  async connect() {
    this.db = await new MongoClient().connect(config.db.mongoConnectionUri);
  }

  getCollection<T extends Document>(collectionName: string): Collection<T> {
    return this.db.collection<T>(collectionName);
  }

  close() {
    return this.client.close();
  }
}

const database = new DatabaseService();
try {
  await database.connect();
} catch (err) {
  Logger.error("Failed to connect to database", err);
  Deno.exit(1);
}

export default database;
