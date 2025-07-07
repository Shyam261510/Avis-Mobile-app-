import axios from "axios";

async function createMessage(userId: string, key: string, message: string) {
  try {
    const url = `https://chat.botpress.cloud/${process.env.CHAT_ID}/messages`;
    await axios.post(
      url,
      {
        conversationId: userId,
        payload: {
          type: "text",
          text: message,
        },
      },
      {
        headers: {
          "x-user-key": key,
        },
      }
    );

    return { success: true, message: "Message send to botpress" };
  } catch (error) {
    console.error("Error creating message:", error);
    // You can handle the error here or re-throw it
    return {
      success: false,
      message: "Could not able to send message to botpress",
    };
  }
}

export default createMessage;
