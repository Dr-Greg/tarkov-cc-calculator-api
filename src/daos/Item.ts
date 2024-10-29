import type {
    Collection,
    Document,
    Filter,
    FindOptions,
    ObjectId,
} from "@db/mongo";
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

    async fetchItemsWithDuplicates(ids: ObjectId[]): Promise<Item[]> {
        const uniqueItems = await this.find({ _id: { $in: ids } });
        const itemMap = new Map(
            uniqueItems.map((item) => [item._id.toString(), item]),
        );
        return ids.map((id) => itemMap.get(id.toString())).filter(
            Boolean,
        ) as Item[];
    }

    async validateLockedItems(
        ids: ObjectId[],
    ): Promise<{ lockedItems: Item[]; missingIds: ObjectId[] }> {
        const lockedItems = await this.fetchItemsWithDuplicates(ids);
        const foundIds = new Set(
            lockedItems.map((item) => item._id.toString()),
        );
        const missingIds = ids.filter((id) => !foundIds.has(id.toString()));
        return { lockedItems, missingIds };
    }
}

export default new ItemDAO();
