import type { Context } from "@oak/oak";
import Item from "../daos/Item.ts";
import Logger from "../helpers/Logger.ts";

export default async function (ctx: Context) {
  try {
    const items = await Item.find();
    ctx.response.body = items;
  } catch (err) {
    Logger.warn("[getAllItems] -", err);
    throw err;
  }
}
