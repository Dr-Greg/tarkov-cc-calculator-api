import { Context, Next } from "@oak/oak";
import type { ZodSchema } from "zod";
import { BadRequest } from "../../helpers/HttpError.ts";
import Logger from "../../helpers/Logger.ts";

const validateBody = <T>(schema: ZodSchema) => {
    return async (ctx: Context, next: Next) => {
        let body: T;

        try {
            body = await ctx.request.body.json();
        } catch (err) {
            Logger.warn("[validateBody] - Invalid JSON format ", err);
            throw new BadRequest("Invalid JSON format");
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            Logger.warn("[validateBody] - ", parsed.error.errors);
            throw new BadRequest("Validation failed", parsed.error.errors);
        }

        ctx.state.body = parsed.data;

        await next();
    };
};

export { validateBody };
