import axios from "axios";
// Adding a 5-second delay to allow Botpress time to process and generate a response after the message is sent.

async function getMessages(
  id: string,
  key: string,
  delayMs: number = 10000
): Promise<any> {
  // Add delay before making the API call
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  try {
    const getMessagesUrl = `https://chat.botpress.cloud/${process.env.CHAT_ID}/conversations/${id}/messages`;
    const res = await axios.get(getMessagesUrl, {
      headers: {
        "x-user-key": key,
      },
    });

    const results = res.data.messages[0];
    const responseMessage = results.payload;

    console.log({
      response: responseMessage.text,
      options: responseMessage.options,
    });

    return {
      success: true,
      response: responseMessage.text,
      options: responseMessage.options,
    };
  } catch (error) {
    console.error("Error fetching messages:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      response: null,
      options: null,
    };
  }
}

export default getMessages;
