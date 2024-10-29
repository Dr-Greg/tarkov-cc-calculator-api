import type { Context } from "@oak/oak";
import Item from "../daos/Item.ts";

export default async function (ctx: Context) {
  try {
    const items = await Item.find();
    ctx.response.body = items;
  } catch (err) {
    console.error("[getAllItems] -", err);
    throw err;
  }
}
