import type { Context } from "@oak/oak";
import Item from "../daos/Item.ts";
import findBestCombination from "../helpers/best-item-combo.ts";
import { BadRequest } from "../helpers/HttpError.ts";
import Logger from "../helpers/Logger.ts";
import type { BestItemComboBody } from "../schemas/best-item-combo.schema.ts";

export default async function handleCombinationRequest(
  ctx: Context<{ body: BestItemComboBody }>,
) {
  try {
    const { types, threshold, exclude, lock } = ctx.state.body;

    const { lockedItems, missingIds } = await Item.validateLockedItems(
      lock,
    );
    if (missingIds.length) {
      throw new BadRequest(
        `Items with provided IDs does not exist. Missing IDs: ${
          missingIds.join(", ")
        }`,
      );
    }

    const itemAggregation = await Item.aggregate([
      {
        $match: {
          $expr: {
            $and: [{ $lt: ["$basePrice", threshold] }, {
              $lt: ["$lastLowPrice", "$basePrice"],
            }],
          },
          types: { $in: types },
          _id: { $nin: exclude },
        },
      },
    ]);

    const lockedTotals = lockedItems.reduce(
      (acc, item) => {
        acc.basePrice += item.basePrice;
        acc.lastLowPrice += item.lastLowPrice;
        return acc;
      },
      { basePrice: 0, lastLowPrice: 0 },
    );

    const result = findBestCombination(
      itemAggregation,
      threshold - lockedTotals.basePrice,
      5 - lockedItems.length,
    );

    ctx.response.body = {
      items: [...lockedItems, ...result.selectedItems],
      basePrice: result.totalBasePrice + lockedTotals.basePrice,
      fleaPrice: result.totalLastLowPrice + lockedTotals.lastLowPrice,
    };
  } catch (err) {
    Logger.warn("[getBestItemCombo] -", err);
    throw err;
  }
}
