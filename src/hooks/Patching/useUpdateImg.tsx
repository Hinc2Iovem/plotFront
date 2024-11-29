import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../api/axios";

type UploadImageTypes = {
  preview: string | ArrayBuffer | null;
  path: string;
  id?: string;
};

const handleUploadeImg = async ({ preview, path, id }: UploadImageTypes) => {
  const formData = new FormData();

  formData.append("file", preview as string);
  formData.append("upload_preset", "SevenHS");
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
  const frontImg = await fetch("https://api.cloudinary.com/v1_1/dbfyil6fb/image/upload", {
    method: "POST",
    body: formData,
  }).then((r) => r.json());

  return await axiosCustomized.patch(`${path}/${id}/img`, {
    imgUrl: frontImg.secure_url,
  });
};

export default function useUpdateImg({ preview, id, path }: UploadImageTypes) {
  return useMutation({
    mutationKey: ["uploadImage", preview],
    mutationFn: ({ bodyId }: { bodyId?: string }) =>
      handleUploadeImg({ id: bodyId?.trim().length ? bodyId : id, path, preview: preview }),
  });
}
