import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import createMessage from "../helper/createMessage";
import getMessages from "../helper/getMessage";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  console.log("calling /api/createMessage");
  const { userId, message, botPressUserKey } = req.body;

  if (!userId || !message || !botPressUserKey) {
    console.warn("Invalid Inputs:", { userId, message, botPressUserKey });
    return res.status(400).json({ success: false, message: "Invalid inputs." });
  }

  try {
    // Step 1: Send user message to Botpress
    const sendBotpressMessage = await createMessage(
      userId,
      botPressUserKey,
      message
    );

    if (!sendBotpressMessage.success) {
      return res.status(502).json({
        success: false,
        message: "Failed to send message to Botpress.",
      });
    }

    // Step 2: Create a new chat and save user message
    const newChat = await prisma.chat.create({
      data: { userId },
    });

    const newMessage = await prisma.message.create({
      data: {
        chatId: newChat.id,
        userMessage: message,
      },
    });

    // Step 3: Get Botpress response
    const botPressResponse = await getMessages(userId, botPressUserKey);
    const { success, response, options } = botPressResponse;

    if (!success) {
      return res.status(502).json({
        success: false,
        message: "Failed to get response from Botpress.",
      });
    }

    // Step 4: Store bot response in database
    await prisma.botMessage.create({
      data: {
        messageId: newMessage.id,
        botResponse: response,
        option: options?.map((data: any) => data.label) || [],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Message processed successfully.",
    });
  } catch (error: unknown) {
    console.error("Error in message route:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      ...(process.env.NODE_ENV === "development" && {
        debug: (error as Error).message,
      }),
    });
  }
});

export default router;
