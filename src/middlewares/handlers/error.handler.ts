import type { Context, Next } from "@oak/oak";
import { HttpError, InternalServerError } from "../../helpers/HttpError.ts";
import Logger from "../../helpers/Logger.ts";

export default async function errorHandler(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err) {
        if (err instanceof InternalServerError) {
            Logger.error("Internal Server Error", err).write();
            ctx.response.status = err.statusCode;
        } else if (err instanceof HttpError) {
            ctx.response.status = err.statusCode;
            const responseBody: { message: string; details?: unknown } = {
                message: err.message,
            };
            if (err.details) {
                responseBody.details = err.details;
            }
            ctx.response.body = responseBody;
        } else {
            Logger.error("Unhandled error", err).write();
            ctx.response.status = 500;
        }
    }
}
