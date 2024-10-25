import type { Context } from "@oak/oak";
import { Router } from "@oak/oak/router";
import getAllItems from "./controllers/get-items.ts";
import getItemsWithCategory from "./controllers/get-items-with-category.ts";
import getBestItemCombo from "./controllers/get-best-item-combo.ts";

const router = new Router({ prefix: "/tarkov-cc-api" });

router.get("/health", (ctx: Context) => {
  ctx.response.body = { health: "OK" };
});

router.get("/", getAllItems).post("/", getItemsWithCategory).post(
  "/best-item-combo",
  getBestItemCombo,
);

export default router;
