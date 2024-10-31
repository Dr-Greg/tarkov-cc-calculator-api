import type { Context } from "@oak/oak";
import { Router } from "@oak/oak/router";
import getBestItemCombo from "./controllers/get-best-item-combo.ts";
import getItemsWithFilters from "./controllers/get-items-with-filters.ts";
import getAllItems from "./controllers/get-items.ts";
import { validateBody } from "./middlewares/handlers/body-validation.handler.ts";
import bestItemComboSchema from "./schemas/best-item-combo.schema.ts";
import getItemsBodySchema from "./schemas/get-items.schema.ts";

const router = new Router({ prefix: "/tarkov-cc-api" });

router.get("/health", (ctx: Context) => {
  ctx.response.body = { health: "OK" };
});

router.get("/status", (ctx: Context) => {
  ctx.response.body = { health: "OK" };
});

router.get("/", getAllItems).post(
  "/",
  validateBody(getItemsBodySchema),
  getItemsWithFilters,
).post(
  "/best-item-combo",
  validateBody(bestItemComboSchema),
  getBestItemCombo,
);

export default router;
