import { useEffect, useState } from "react";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { TranslationAppearancePartTypes } from "../../types/Additional/TranslationTypes";
import PreviewImage from "../shared/utilities/PreviewImage";
import useGetAppearancePartById from "../../hooks/Fetching/AppearancePart/useGetAppearancePartById";

export default function WardrobeItem({
  appearancePartId,
  translations,
}: TranslationAppearancePartTypes) {
  const { data: appearancePart } = useGetAppearancePartById({
    appearancePartId,
  });
  const [text] = useState(translations[0]?.text || "");
  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const updateImg = useUpdateImg({
    id: appearancePartId,
    path: "/appearanceParts",
    preview: imagePreview,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted && imagePreview) {
      updateImg.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagePreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <article className="w-full min-h-[20rem] h-full rounded-md shadow-md shadow-gray-400 bg-white">
      <div className="relative border-[3px] w-full h-[20rem] border-white">
        {appearancePart?.img ? (
          <img
            src={appearancePart?.img}
            alt="StoryBg"
            className={`w-[10rem] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer absolute rounded-md`}
          />
        ) : (
          <PreviewImage
            imgClasses="w-[10rem] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer absolute rounded-md"
            imagePreview={imagePreview}
            setPreview={setPreview}
          />
        )}
      </div>
      <div className="bg-white w-full p-[1rem] rounded-b-md shadow-md shadow-gray-400">
        <p className="text-[1.5rem] hover:text-gray-600 transition-all">
          {text}
        </p>
      </div>
    </article>
  );
}
