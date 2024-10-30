import { Application } from "@oak/oak";

import { config } from "./config.ts";
import errorHandler from "./middlewares/handlers/error.handler.ts";
import loggerMiddleware from "./middlewares/logger.middleware.ts";
import router from "./router.ts";

const app = new Application();

app.use(errorHandler);
app.use(loggerMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: config.server.port });
