import type { ObjectId } from "@db/mongo";
import type { ValidType } from "./src/constants/item_types.ts";

declare global {
  interface Item {
    _id: ObjectId;
    id: string;
    name: string;
    shortName: string;
    basePrice: number;
    lastLowPrice: number;
    types: ValidType[];
  }
}
