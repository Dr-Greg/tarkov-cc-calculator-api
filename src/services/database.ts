import { MongoClient, Database, Collection, type Document } from "@db/mongo";
import { config } from "../config.ts";

class DatabaseService {
  private client: MongoClient = new MongoClient();
  private db!: Database;

  constructor() {}

  async connect() {
    this.db = await new MongoClient().connect(
      `mongodb+srv://${config.db.username}:${config.db.encodedPassword}@tarkov.t2hle.mongodb.net/${config.db.database}?authMechanism=SCRAM-SHA-1`
    );
  }

  getCollection<T extends Document>(collectionName: string): Collection<T> {
    return this.db.collection<T>(collectionName);
  }

  fetchAll<T extends Document>(collectionName: string): Promise<Array<T>> {
    const collection = this.getCollection<T>(collectionName);
    return collection.find().toArray();
  }

  close() {
    return this.client.close();
  }
}

const database = new DatabaseService();
await database.connect();

export default database;
