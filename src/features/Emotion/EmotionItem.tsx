import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useUpdateImg from "../../hooks/Patching/useUpdateImg";
import { EmotionsTypes } from "../../types/StoryData/Character/CharacterTypes";
import SyncLoad from "../../ui/Loaders/SyncLoader";
import PreviewImage from "../../ui/shared/PreviewImage";
import { EmotionValueTypes } from "../Editor/PlotField/PlotFieldMain/Commands/Prompts/Emotions/PlotfieldEmotionPromptMain";
import { toast } from "sonner";
import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";

type EmotionItemTypes = {
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionValueTypes>>;
  setInitEmotionValue: React.Dispatch<React.SetStateAction<EmotionValueTypes>>;
  emotionValue: EmotionValueTypes;
  created: boolean | null;
  characterId: string;
} & EmotionsTypes;

export default function EmotionItem({
  emotionName,
  imgUrl,
  _id,
  created,
  emotionValue,
  characterId,
  setEmotionValue,
  setInitEmotionValue,
}: EmotionItemTypes) {
  const queryClient = useQueryClient();
  const [imgPreview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [currentEmotion, setCurrentEmotion] = useState<EmotionValueTypes>({
    emotionId: _id,
    emotionImg: imgUrl || emotionValue.emotionImg,
    emotionName: emotionName || emotionValue.emotionName,
  });

  useEffect(() => {
    setCurrentEmotion((prev) => ({
      ...prev,
      emotionImg: imgUrl || "",
    }));
  }, [imgUrl]);

  useEffect(() => {
    if (typeof created === "boolean" && emotionValue.emotionId === _id) {
      setCurrentEmotion(emotionValue);
    }
  }, [created]);

  const { mutateAsync: updateImg, isPending } = useUpdateImg({
    id: _id,
    path: "/characterEmotions",
    preview: imgPreview,
  });

  useEffect(() => {
    const uploadAndInvalidate = async () => {
      if (isMounted && imgPreview) {
        try {
          await updateImg({ bodyId: _id });
          queryClient.invalidateQueries({
            queryKey: ["character", characterId],
          });
          toast("Картинка была обновлена", toastSuccessStyles);
        } catch (error) {
          toast("Ой, ой, изображение не было загруженно", toastErrorStyles);
          console.error("Image upload failed:", error);
        }
      }
    };

    uploadAndInvalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgPreview, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <article className={`rounded-md h-[337px] w-full border-border border-[1px] relative`}>
      {currentEmotion?.emotionImg ? (
        <img
          src={currentEmotion.emotionImg}
          alt="EmotionImg"
          className="object-contain w-[80%] h-[80%] cursor-pointer rounded-t-md mx-auto mt-[10px]"
        />
      ) : (
        <PreviewImage
          imgClasses="absolute object-cover rounded-md h-[200px] -translate-y-[137px] -translate-x-1/2 left-1/2"
          divClasses="top-1/2 relative"
          imagePreview={imgPreview}
          setPreview={setPreview}
        />
      )}
      <button
        onClick={() => {
          setEmotionValue(currentEmotion);
          setInitEmotionValue(currentEmotion);
        }}
        className="absolute text-[30px] text-start bottom-0 w-full rounded-b-md text-text bg-background px-[10px] py-[5px]"
      >
        {`${currentEmotion.emotionName}`.trim().length > 22
          ? `${currentEmotion.emotionName}...`.substring(0, 22)
          : `${currentEmotion.emotionName}`}
      </button>
      {isPending && (
        <SyncLoad conditionToLoading={!isPending} conditionToStart={isPending} className="top-[10px] right-[10px] " />
      )}
    </article>
  );
}
