import { ObjectId } from "@db/mongo";
import { z } from "zod";

export default z.string().refine((id) => /^[0-9a-f]{24}$/.test(id), {
    message: "Invalid ObjectId format",
}).transform((id) => new ObjectId(id));
