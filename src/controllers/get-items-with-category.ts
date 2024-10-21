import type { Context } from "@oak/oak";
import Item from "../daos/Item.ts";

export default async function (ctx: Context) {
  try {
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { message: "no body" };
      return;
    }

    const types = await ctx.request.body.json();
    if (!types || !types.length) {
      ctx.response.status = 400;
      ctx.response.body = { message: "no types" };
      return;
    }
    const items = await Item.find({ types: { $in: types } });
    ctx.response.body = items;
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
  }
}
