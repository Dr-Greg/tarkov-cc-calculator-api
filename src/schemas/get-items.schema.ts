import { z } from "zod";
import { ALL_TYPES, DEFAULT_TYPES } from "../constants/item_types.ts";
import objectIDSchema from "./objectID.schema.ts";

const getItemsBodySchema = z.object({
    types: z.array(z.enum(ALL_TYPES)).transform((types) =>
        types.length ? types : [...DEFAULT_TYPES]
    ).default([...DEFAULT_TYPES]),
    exclude: z.array(objectIDSchema).default([]),
});

export type GetItemsBody = z.infer<typeof getItemsBodySchema>;

export default getItemsBodySchema;
