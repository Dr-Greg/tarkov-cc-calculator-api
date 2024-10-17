import { Application } from "@oak/oak";

import router from "./router.ts";
import { config } from "./config.ts";

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: config.server.port });
