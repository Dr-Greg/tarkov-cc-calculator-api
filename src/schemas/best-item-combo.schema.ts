import { z } from "zod";
import { ALL_TYPES, DEFAULT_TYPES } from "../constants/item_types.ts";
import objectIDSchema from "./objectID.schema.ts";

const bestItemComboSchema = z.object({
    types: z.array(z.enum(ALL_TYPES)).transform((types) =>
        types.length ? types : DEFAULT_TYPES
    ).default([...DEFAULT_TYPES]),
    threshold: z.number().int().positive(),
    exclude: z.array(objectIDSchema).default([]),
    lock: z.array(objectIDSchema).max(4).default([]),
});

export type BestItemComboBody = z.infer<typeof bestItemComboSchema>;

export default bestItemComboSchema;
