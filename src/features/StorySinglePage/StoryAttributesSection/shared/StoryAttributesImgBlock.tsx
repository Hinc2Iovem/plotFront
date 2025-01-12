import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import PreviewImage from "@/ui/shared/PreviewImage";
import { useEffect, useState } from "react";

type StoryImgBlockTypes = {
  id: string;
  path: string;
  img: string | ArrayBuffer | null;
};

export default function StoryAttributesImgBlock({ id, path, img }: StoryImgBlockTypes) {
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(img);

  useEffect(() => {
    setPreview(img);
  }, [img]);

  const uploadImgMutation = useUpdateImg({
    id: id,
    path: path,
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      uploadImgMutation.mutate({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`w-full h-[247px] p-[10px] border-border border-[1px] rounded-md relative`}>
      <PreviewImage
        imgClasses="object-cover rounded-md absolute max-h-[200px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        divClasses="top-1/2"
        imagePreview={imagePreview}
        setPreview={setPreview}
      />
    </div>
  );
}
