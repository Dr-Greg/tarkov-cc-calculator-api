import type { Context, Next } from "@oak/oak";
import { HttpError, InternalServerError } from "../../helpers/HttpError.ts";

export default async function errorHandler(ctx: Context, next: Next) {
    try {
        await next();
    } catch (err) {
        if (err instanceof HttpError) {
            ctx.response.status = err.statusCode;
            const responseBody: { message: string; details?: unknown } = {
                message: err.message,
            };
            if (err.details) {
                responseBody.details = err.details;
            }
            ctx.response.body = responseBody;
        } else {
            console.error("Unhandled error:", err);
            const internalError = new InternalServerError(
                "An unexpected error occurred",
            );
            ctx.response.status = internalError.statusCode;
            ctx.response.body = { message: internalError.message };
        }
    }
}
