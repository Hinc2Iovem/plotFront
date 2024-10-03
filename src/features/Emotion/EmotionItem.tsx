import { useEffect, useState } from "react";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import PreviewImage from "../shared/utilities/PreviewImage";
import { EmotionsTypes } from "../../types/StoryData/Character/CharacterTypes";
import SyncLoad from "../shared/Loaders/SyncLoader";

export default function EmotionItem({
  emotionName,
  imgUrl,
  _id,
}: EmotionsTypes) {
  const [imgPreview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { mutate: updateImg, isPending } = useUpdateImg({
    id: _id,
    path: "/characterEmotions",
    preview: imgPreview,
  });

  useEffect(() => {
    if (isMounted && imgPreview) {
      updateImg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgPreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <article className="w-full min-h-[24rem] h-full rounded-md shadow-md shadow-gray-400 bg-white relative">
      <div className="relative border-[3px] w-full h-[20rem] border-white">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="StoryBg"
            className={`w-[10rem] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer absolute rounded-md`}
          />
        ) : (
          <PreviewImage
            imgClasses="w-[10rem] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 cursor-pointer absolute rounded-md"
            imagePreview={imgPreview}
            setPreview={setPreview}
          />
        )}
      </div>
      <div className="bg-white w-full p-[1rem] rounded-b-md shadow-md shadow-gray-400">
        <p className="text-[1.5rem] hover:text-gray-600 transition-all">
          {emotionName}
        </p>
      </div>
      {isPending && (
        <SyncLoad
          conditionToLoading={!isPending}
          conditionToStart={isPending}
          className="top-[1rem] right-[1rem] "
        />
      )}
    </article>
  );
}
