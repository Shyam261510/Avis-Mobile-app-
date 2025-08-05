import { prisma } from "../libs/prisma"; // Prisma client for DB access
import { Router, Request, Response } from "express";

const router = Router();
router.get("/", async (req: Request, res: Response): Promise<any> => {
  console.log("calling /api/getMessages");
  try {
    const userId = req.query.userId as string;

    const chats =
      (await prisma.chat.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          messages: {
            select: {
              id: true,
              userMessage: true,
              botMessages: {
                select: {
                  id: true,
                  botResponse: true,
                  option: true,
                },
              },
            },
          },
        },
      })) ?? [];

    return res.json({ success: true, chats });
  } catch (error: any) {
    console.error("Error fetching chat:", error);
    return res.json({
      success: false,
      message: "Something went wrong",
      error: error.message || error,
    });
  }
});
export default router;
