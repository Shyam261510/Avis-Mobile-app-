import { Router, Request, Response } from "express";
import { profileSetupSchema } from "../schema/ProfileSchema";
import { prisma } from "../libs/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  console.log("Calling login /api/create-profile");
  try {
    const body = req.body;

    const result = profileSetupSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = JSON.parse(result.error.message)[0].message;
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const {
      userId,
      DOB,
      country,
      destination,
      field_of_Interest,
      education,
      GPA,
      experience,
      budget,
    } = result.data;

    await prisma.profileInfo.create({
      data: {
        userId,
        DOB,
        country,
        destination,
        field_of_Interest,
        education,
        GPA,
        experience,
        budget,
      },
    });

    return res.json({ success: true, message: "Profile setup successfully" });
  } catch (error: any) {
    console.error("Profile setup error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while setting up the profile.",
    });
  }
});

export default router;
