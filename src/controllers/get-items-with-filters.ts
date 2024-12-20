import type { Context } from "@oak/oak";
import Item from "../daos/Item.ts";
import Logger from "../helpers/Logger.ts";
import type { GetItemsBody } from "../schemas/get-items.schema.ts";

export default async function (ctx: Context<{ body: GetItemsBody }>) {
  try {
    const { types, exclude } = ctx.state.body;

    const items = await Item.find({
      _id: { $nin: exclude },
      types: { $in: types },
    });

    ctx.response.body = items;
  } catch (err) {
    Logger.warn("[getItemsWithFilters] -", err);
    throw err;
  }
}
