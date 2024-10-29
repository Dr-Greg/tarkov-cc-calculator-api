import type { Context } from "@oak/oak";
import { Router } from "@oak/oak/router";
import getBestItemCombo from "./controllers/get-best-item-combo.ts";
import getItemsWithCategory from "./controllers/get-items-with-category.ts";
import getAllItems from "./controllers/get-items.ts";
import { validateBody } from "./middlewares/handlers/body-validation.handler.ts";
import bestItemComboSchema from "./schemas/best-item-combo.schema.ts";

const router = new Router({ prefix: "/tarkov-cc-api" });

router.get("/health", (ctx: Context) => {
  ctx.response.body = { health: "OK" };
});

router.get("/", getAllItems).post(
  "/",
  getItemsWithCategory,
).post(
  "/best-item-combo",
  validateBody(bestItemComboSchema),
  getBestItemCombo,
);

export default router;
