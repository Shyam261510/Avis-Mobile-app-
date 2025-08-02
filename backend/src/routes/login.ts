import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma"; // Prisma client for DB access
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  console.log("Calling login route");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and password",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      botPressUserKey: user.botPressUserKey,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_CODE!, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        botPressUserKey: user.botPressUserKey,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

export default router;
