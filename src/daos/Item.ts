import type { Collection, Filter, FindOptions } from "@db/mongo";
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
}

export default new ItemDAO();
