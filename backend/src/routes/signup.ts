// src/routes/signup.ts

import { Router, Request, Response } from "express";
import { prisma } from "../libs/prisma"; // Prisma client for DB access
import bcryptjs from "bcryptjs"; // For hashing passwords
import createBotPressUser from "../helper/createBotPressUser"; // Helper function to create user in BotPress

const router = Router();

// Route: POST /signup - Handles user registration
router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    // Destructure required fields from the request body
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields for signup",
      });
    }

    // Check if user with the given email already exists
    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserExist) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use. Please try a different one.",
      });
    }

    // Generate salt and hash the password securely
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Create corresponding BotPress user for the new account
    const { success, message } = await createBotPressUser(newUser.id, username);

    // If BotPress creation fails, still return 201 but with a warning message
    if (!success) {
      return res.status(201).json({
        success: true,
        message,
      });
    }

    // Return success response if everything is fine
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
    // Log and return generic error response for any unhandled issues
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

export default router; // Export the Express router
