import * as z from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const userIdSchema = z.object({
  userId: z.string().regex(objectIdRegex, "Invalid ObjectId"),
});
