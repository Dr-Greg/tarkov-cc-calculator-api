import { ObjectId } from "@db/mongo";
import type { Context } from "@oak/oak";
import { ALL_TYPES, DEFAULT_TYPES } from "../constants/item_types.ts";
import Item from "../daos/Item.ts";
import findBestCombination from "../helpers/best-item-combo.ts";

function validateTypes(
  types: string[],
): { validTypes: string[]; invalidTypes: string[] } {
  const validTypes = types.filter((type) => ALL_TYPES.includes(type));
  const invalidTypes = types.filter((type) => !ALL_TYPES.includes(type));
  return { validTypes, invalidTypes };
}

function parseObjectIds(exclude: unknown): ObjectId[] {
  if (!Array.isArray(exclude)) {
    return [];
  }

  const validIds: ObjectId[] = [];
  for (const item of exclude) {
    if (typeof item === "string") {
      validIds.push(new ObjectId(item));
    }
  }

  return validIds.length ? validIds : [];
}

export default async function (ctx: Context) {
  try {
    const { types, threshold, exclude } = await ctx.request.body.json();
    const { validTypes, invalidTypes } = validateTypes(types || []);

    const excludedIds = parseObjectIds(exclude);

    if (typeof threshold !== "number") {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Invalid threshold provided",
        threshold,
        message: "Threshold must be a valid number",
      };
      return;
    }

    const validThreshold = threshold | 0;

    if (invalidTypes.length) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Invalid item types provided",
        invalidTypes,
        message: `Valid types are: ${ALL_TYPES.join(", ")}`,
      };
      return;
    }

    const items = await Item.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $lt: ["$basePrice", threshold] },
              { $lt: ["$lastLowPrice", "$basePrice"] },
            ],
          },
          types: { $in: validTypes.length ? validTypes : DEFAULT_TYPES },
          _id: { $nin: excludedIds },
        },
      },
    ]);

    const result = findBestCombination(
      items,
      validThreshold,
    );

    ctx.response.body = result;
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
