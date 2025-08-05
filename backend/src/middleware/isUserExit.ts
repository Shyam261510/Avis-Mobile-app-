import { Request, Response, NextFunction } from "express";
import { prisma } from "../libs/prisma";
import { userIdSchema } from "../schema/UserId.Schema";

export const isUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Combine both sources of userId into a single object
    const input = req.body?.userId
      ? { userId: req.body.userId }
      : { userId: req.query.userId };

    const result = userIdSchema.safeParse(input);

    if (!result.success) {
      // Get the first error message directly from Zod

      const errorMessage =
        JSON.parse(result.error.message)[0].message ?? "Invalid input";
      return res.status(400).json({ success: false, message: errorMessage });
    }

    const { userId } = result.data;

    const isUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Middleware error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
