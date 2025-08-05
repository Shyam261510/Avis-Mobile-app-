import * as z from "zod";
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const profileSetupSchema = z.object({
  userId: z.string().regex(objectIdRegex, "Invalid ObjectId"),
  DOB: z.string(),
  country: z.string(),
  destination: z.string(),
  field_of_Interest: z.string(),
  education: z.string(),
  GPA: z.string(),
  experience: z.string(),
  budget: z.string(),
});
