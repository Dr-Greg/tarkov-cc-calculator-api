import type { Context } from "@oak/oak";
import Item from "../daos/Item.ts";

export default async function (ctx: Context<{ body: Array<string> }>) {
  try {
    const types = await ctx.request.body.json();
    if (!types || !types.length) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Invalid threshold provided",
        message: "Threshold must be a valid number",
      };
      return;
    }
    const items = await Item.find({ types: { $in: types } });
    ctx.response.body = items;
  } catch (err) {
    if (String(err).includes("BadRequestError")) {
      ctx.response.status = 400;
      ctx.response.body = { message: "invalid body" };
      return;
    }
    console.log(err);
    ctx.response.status = 500;
  }
}
