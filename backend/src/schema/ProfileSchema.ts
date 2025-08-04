import * as z from "zod";

export const profileSetupSchema = z.object({
  userId: z.string(),
  DOB: z.string(),
  country: z.string(),
  destination: z.string(),
  field_of_Interest: z.string(),
  education: z.string(),
  GPA: z.string(),
  experience: z.string(),
  budget: z.string(),
});
