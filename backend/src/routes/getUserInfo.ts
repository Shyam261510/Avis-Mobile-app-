import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<any> => {
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

    const userInfo = jwt.verify(token, process.env.JWT_CODE!);

    res.status(200).json({ success: true, user: userInfo });
  } catch (error) {
    console.error("JWT verification failed:", error);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

export default router;
