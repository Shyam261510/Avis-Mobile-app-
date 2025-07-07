// src/routes/signup.ts
import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import bcryptjs from "bcryptjs";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { username, email, password } = req.body;
  console.log({ username, email, password });

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields for signup",
    });
  }

  try {
    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserExist) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use. Please try a different one.",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

export default router; // ✅ Confirm this is a Router
