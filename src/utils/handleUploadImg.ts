type UploadImageTypes = {
  preview: string | ArrayBuffer | null;
};

export const handleUploadeImg = async ({
  preview,
}: UploadImageTypes): Promise<string> => {
  const formData = new FormData();

  formData.append("file", preview as string);
  formData.append("upload_preset", "SevenHS");
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
  const frontImg = await fetch(
    "https://api.cloudinary.com/v1_1/dbfyil6fb/image/upload",
    {
      method: "POST",
      body: formData,
    }
  ).then((r) => r.json());

  return frontImg.secure_url;
};
