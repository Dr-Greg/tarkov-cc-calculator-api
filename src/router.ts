import { Router } from "@oak/oak/router";
import { getAll } from "./controllers/get-items.ts";

const router = new Router();

router.get("/tarkov-cc-api", getAll);

export default router;
