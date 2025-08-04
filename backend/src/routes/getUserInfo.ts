import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma";

interface JWTPayload {
  id: string;
  email: string;
  username: string;
  botPressUserKey: string;
  iat: number; // issued at
  exp: number; // expiration time
}

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
  console.log("Calling get user route");
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    // Remove "Bearer " prefix if present
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    let isExpired = false;
    const decoded = jwt.decode(token) as JWTPayload;
    const { exp } = decoded;

    if (Date.now() >= exp * 1000) {
      isExpired = true;
    }
    if (isExpired) {
      return res.status(200).json({ success: true, user: {} });
    }

    let userInfo = jwt.verify(token, process.env.JWT_CODE!) as JWTPayload;

    const profileInfo = await prisma.profileInfo.findFirst({
      where: {
        id: userInfo.id,
      },
    });
    userInfo = { ...userInfo, ...profileInfo };

    return res.status(200).json({ success: true, user: userInfo });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

export default router;
