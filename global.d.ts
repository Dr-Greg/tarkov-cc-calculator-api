import type { ObjectId } from "@db/mongo";

declare global {
  interface Item {
    _id: ObjectId;
    id: string;
    name: string;
    shortName: string;
    basePrice: number;
    lastLowPrice: number;
    types: string[];
  }
}
