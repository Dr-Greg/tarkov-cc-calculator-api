import { Router } from "@oak/oak/router";
import { getAll } from "./controllers/get-items.ts";
import type { Context } from "@oak/oak";

const router = new Router({prefix: "/tarkov-cc-api"});

router.get("/", getAll);
router.get("/health", (ctx: Context) => {ctx.response.body = "ok"});

export default router;
