import database from "../services/database.ts";
import type { Context } from "@oak/oak";

async function getAll(ctx: Context) {
  try {
    const items = await database.fetchAll<Item>("items");
    console.log(items);
    ctx.response.body = items;
  } catch (err) {
    console.log(err);
  }
}

export { getAll };
