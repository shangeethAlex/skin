import { env } from '../env';

export const uploadToCloudinary = async (blob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", env.VITE_CLOUDINARY_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
};