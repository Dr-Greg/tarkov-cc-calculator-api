import type { Collection, Document, Filter, FindOptions } from "@db/mongo";
import database from "../services/Database.ts";

class ItemDAO {
    private readonly collection: Collection<Item>;

    constructor() {
        this.collection = database.getCollection("items");
    }

    find(
        filter: Filter<Item> = {},
        options: FindOptions = {},
    ): Promise<Array<Item>> {
        return this.collection.find(filter, options).toArray();
    }

    aggregate(pipeline: Array<Document>): Promise<Array<Item>> {
        return this.collection.aggregate(pipeline).toArray();
    }
}

export default new ItemDAO();
