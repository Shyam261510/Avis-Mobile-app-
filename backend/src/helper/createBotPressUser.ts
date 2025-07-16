import { prisma } from "../libs/prisma";
import axios, { AxiosError } from "axios";

async function createBotPressUser(userId: string, username: string) {
  if (!userId || !username) {
    return {
      success: false,
      message: "Invalid input. 'userId' and 'username' are required.",
    };
  }

  try {
    // Step 1: Verify user exists
    const existingUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found in the database.",
      };
    }

    // Step 2: Create BotPress user
    let botPressUserResponse;
    try {
      botPressUserResponse = await axios.post(
        `https://chat.botpress.cloud/${process.env.CHAT_ID}/users`,
        {
          name: username,
          id: userId,
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Failed to create BotPress user:", {
        url: err.config?.url,
        message: err.message,
        response: err.response?.data,
      });

      return {
        success: false,
        message: "BotPress user creation failed.",
        ...(process.env.NODE_ENV === "development" && {
          debug: err.response?.data || err.message,
        }),
      };
    }

    const botPressKey = botPressUserResponse.data.key;

    // Step 3: Store key in DB
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { botPressUserKey: botPressKey },
      });
    } catch (error) {
      console.error("Failed to update user with BotPress key:", error);

      return {
        success: false,
        message: "Could not save BotPress key to database.",
        ...(process.env.NODE_ENV === "development" && {
          debug: (error as Error).message,
        }),
      };
    }

    // Step 4: Create conversation in BotPress
    try {
      await axios.post(
        `https://chat.botpress.cloud/${process.env.CHAT_ID}/conversations`,
        { id: userId },
        {
          headers: {
            "x-user-key": botPressKey,
          },
        }
      );
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error("Failed to create BotPress conversation:", {
        url: err.config?.url,
        message: err.message,
        response: err.response?.data,
      });

      return {
        success: false,
        message: "Failed to create conversation in BotPress.",
        ...(process.env.NODE_ENV === "development" && {
          debug: err.response?.data || err.message,
        }),
      };
    }

    // ✅ Everything went well
    return {
      success: true,
      message: "You're ready to start a conversation with 🤖 Stuvis!",
    };
  } catch (error: unknown) {
    console.error("Unexpected server error during setup:", error);
    return {
      success: false,
      message: "Unexpected server error. Please try again later.",
      ...(process.env.NODE_ENV === "development" && {
        debug: (error as Error).message,
      }),
    };
  }
}
export default createBotPressUser;
