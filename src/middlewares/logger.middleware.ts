import type { Context, Next } from "@oak/oak";
import Logger from "../helpers/Logger.ts";

export default async function (ctx: Context, next: Next) {
    const { method, url } = ctx.request;
    const start = performance.now();

    await next();

    const ms = performance.now() - start;
    const { status } = ctx.response;
    const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

    Logger[logLevel](
        `${method} ${url.pathname} - ${status} - ${ms.toFixed(2)}ms`,
    );
}
