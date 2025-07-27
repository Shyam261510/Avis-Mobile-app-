import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId" });
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        documentTitle: true,
        uri: true,
        size: true,
        fileName: true,
      },
    });

    return res.json({ success: true, documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
