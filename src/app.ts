import { Application } from "@oak/oak";

import router from "./router.ts";

const app = new Application();
const port = 8000;

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port });
