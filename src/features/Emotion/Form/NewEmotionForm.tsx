import { toastErrorStyles, toastNotificationStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Input } from "@/components/ui/input";
import { EmotionValueTypes } from "@/features/Editor/PlotField/PlotFieldMain/Commands/Prompts/Emotions/PlotfieldEmotionPromptMain";
import StoryAttributesClearButton from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesClearButton";
import StoryAttributesCreateButton from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesCreateButton";
import StoryAttributesImgBlock from "@/features/StorySinglePage/StoryAttributesSection/shared/StoryAttributesImgBlock";
import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import useCreateEmotion from "@/hooks/Posting/Emotion/useCreateEmotion";
import useUpdateEmotion from "@/hooks/Posting/Emotion/useUpdateEmotion";
import { checkObjectsIdenticalShallow } from "@/utils/checkObjectsIdenticalShallow";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type NewEmotionFormTypes = {
  initEmotionValue: EmotionValueTypes;
  emotionValue: EmotionValueTypes;
  characterId: string;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionValueTypes>>;
  setInitEmotionValue: React.Dispatch<React.SetStateAction<EmotionValueTypes>>;
  setCreated: React.Dispatch<React.SetStateAction<boolean | null>>;
};

export default function NewEmotionForm({
  emotionValue,
  characterId,
  initEmotionValue,
  setEmotionValue,
  setInitEmotionValue,
  setCreated,
}: NewEmotionFormTypes) {
  const queryClient = useQueryClient();
  const createOrSave = !emotionValue?.emotionId?.trim().length ? "create" : "save";

  const [imagePreview, setPreview] = useState<string | ArrayBuffer | null>(emotionValue.emotionImg);

  useEffect(() => {
    setPreview(emotionValue.emotionImg);
  }, [emotionValue.emotionImg]);

  const uploadImgMutation = useUpdateImg({
    path: "/characterEmotions",
    preview: imagePreview,
  });

  const { mutateAsync: createEmotion, isPending: creating } = useCreateEmotion({
    characterId,
    emotionName: emotionValue.emotionName || "",
  });

  const { mutateAsync: updateEmotion, isPending: updating } = useUpdateEmotion({
    characterId,
    emotionId: emotionValue.emotionId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emotionValue?.emotionName?.trim().length) {
      toast("Название Обязательно", toastErrorStyles);
      return;
    }

    if (createOrSave === "create") {
      const emotionId = generateMongoObjectId();

      await createEmotion({
        emotionId,
        emotionBodyName: emotionValue.emotionName,
        imgUrl: emotionValue.emotionImg || "",
      });
      if (imagePreview) {
        await uploadImgMutation.mutateAsync({ bodyId: emotionId || "" });
      }
      queryClient.invalidateQueries({
        queryKey: ["character", characterId],
      });
    } else {
      if (checkObjectsIdenticalShallow(emotionValue, initEmotionValue)) {
        toast("Значения не были обновлены!", toastNotificationStyles);
        return;
      }
      if (imagePreview !== emotionValue.emotionImg) {
        await uploadImgMutation.mutateAsync({ bodyId: emotionValue.emotionId || "" });
      }
      await updateEmotion({
        emotionImg: emotionValue.emotionImg || "",
        emotionName: emotionValue.emotionName,
      });
    }

    toast(`Эмоция была ${createOrSave === "create" ? "создана" : "обновлена"}`, toastSuccessStyles);
    setInitEmotionValue(emotionValue);
    setCreated((prev) => (typeof prev === "boolean" ? !prev : true));
  };

  return (
    <form onSubmit={handleSubmit} className="md:max-w-[355px] w-full flex h-fit flex-col gap-[5px]">
      <StoryAttributesImgBlock setPreview={setPreview} imagePreview={imagePreview} />
      <Input
        value={emotionValue.emotionName || ""}
        onChange={(e) =>
          setEmotionValue((prev) => ({
            ...prev,
            emotionName: e.target.value,
          }))
        }
        placeholder="Эмоция"
        className="w-full border-border border-[1px] rounded-md px-[10px] py-[5px] text-text md:text-[20px]"
      />

      <StoryAttributesCreateButton
        disabled={checkObjectsIdenticalShallow(emotionValue, initEmotionValue) || creating || updating}
        createOrSave={createOrSave}
      />
      <StoryAttributesClearButton
        disabled={creating || updating}
        clear={() => {
          const defaultObj: EmotionValueTypes = {
            emotionId: "",
            emotionImg: "",
            emotionName: "",
          };
          setEmotionValue(defaultObj);
          setInitEmotionValue(defaultObj);
        }}
      />
    </form>
  );
}
