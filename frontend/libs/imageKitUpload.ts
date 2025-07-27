import axios from "axios";
import ImageKit from "imagekit-javascript";

// Create ImageKit instance (without auth params, since you use signature auth)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.IMAGE_KIT_PUBLIC_URL_ENDPOINT!,
});
const authenticator = async () => {
  try {
    // You can pass headers as well and later validate the request source in the backend, or you can use headers for any other use case.
    const response = await axios.get(
      `${process.env.API_URL!}/api/imageKitAuth`
    );
    const { success, signature, expire, token } = response.data;

    return { success, signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

export const uploadFile = async (
  file: string,
  fileName: string
): Promise<any> => {
  const auth = await authenticator();

  return new Promise((resolve, reject) => {
    imagekit.upload(
      {
        file, // base64 string, file URL, or file buffer
        fileName,
        ...auth,
      },
      (err: any, result: any) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
