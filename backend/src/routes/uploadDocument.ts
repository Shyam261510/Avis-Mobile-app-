import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  console.log("Calling /api/getDocuments?userId");
  try {
    const { fileName, size, uri, documentTitle, userId } = req.body;

    if (!fileName || !size || !uri || !documentTitle || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid document inputs",
      });
    }

    const isUserExist = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!isUserExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await prisma.document.create({
      data: {
        fileName,
        size,
        uri,
        documentTitle,
        userId,
      },
    });

    return res.json({
      success: true,
      message: "Document Uploaded Successfully",
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while uploading the document",
    });
  }
});

export default router;
