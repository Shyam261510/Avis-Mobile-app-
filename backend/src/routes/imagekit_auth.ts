import { Router, Request, Response } from "express";
import { createHmac, randomUUID } from "crypto";

const router = Router();
const private_key = process.env.IMAGEKIT_PRIVATE_KEY!;

router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const token = String(req.query.token || randomUUID());
    const expire = String(
      req.query.expire || Math.floor(Date.now() / 1000) + 2400
    );

    const privateAPIKey = `${private_key}`;
    const signature = createHmac("sha1", privateAPIKey)
      .update(token + expire)
      .digest("hex");

    return res.json({ success: true, token, expire, signature });
  } catch (error) {
    console.error("Error generating ImageKit auth parameters:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
});

export default router;
