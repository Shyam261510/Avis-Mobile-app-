import { Router, Request, Response } from "express";

import { prisma } from "../libs/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  console.log("Calling /api/get-profile-info");
  try {
    const userId = req.query.userId as string;

    const profileInfo = await prisma.profileInfo.findFirst({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({ success: true, profileInfo });
  } catch (error) {
    console.error("Error in getting profileInfo ", error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

export default router;
