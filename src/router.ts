import { Router } from "@oak/oak/router";
import { getAll } from "./controllers/get-items.ts";

const router = new Router();

router.get("/", getAll);

export default router;
