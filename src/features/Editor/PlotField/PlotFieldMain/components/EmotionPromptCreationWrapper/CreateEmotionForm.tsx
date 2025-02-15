import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter } from "@/components/ui/sheet";

import useUpdateImg from "@/hooks/Patching/useUpdateImg";
import useCreateEmotion from "@/hooks/Posting/Emotion/useCreateEmotion";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import PreviewImage from "@/ui/shared/PreviewImage";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EmotionTypes } from "../../Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type CreateEmotionFormTypes = {
  setStartCreatingEmotion: React.Dispatch<React.SetStateAction<boolean>>;
  onBlur: (value: EmotionTypes) => void;
  startCreatingEmotion: boolean;
  creatingEmotionName: string;
  characterId: string;
};

export default function CreateEmotionForm({
  setStartCreatingEmotion,
  onBlur,
  characterId,
  startCreatingEmotion,
  creatingEmotionName,
}: CreateEmotionFormTypes) {
  const [emotionName, setEmotionName] = useState(creatingEmotionName || "");

  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);

  useEffect(() => {
    if (creatingEmotionName) {
      setEmotionName(creatingEmotionName);
    }
  }, [creatingEmotionName]);

  const uploadImgMutation = useUpdateImg({
    path: "/characterEmotions",
    preview: imagePreview,
  });

  const { mutateAsync: createEmotion } = useCreateEmotion({
    characterId,
    emotionName,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emotionName.trim().length) {
      toast("Название обязательно", toastErrorStyles);
      return;
    }

    const emotionId = generateMongoObjectId();
    setStartCreatingEmotion(false);
    toast("Эмоция создана", toastSuccessStyles);
    onBlur({ emotionName, _id: emotionId, imgUrl: typeof imagePreview === "string" ? imagePreview : "" });
    await createEmotion({ emotionId });
    if (imagePreview) {
      await uploadImgMutation.mutateAsync({ bodyId: emotionId });
    }
  };

  return (
    <Sheet onOpenChange={setStartCreatingEmotion} open={startCreatingEmotion}>
      <SheetContent onSubmit={handleSubmit} side={"top"}>
        <div className="flex md:flex-row flex-col gap-[10px]">
          <div className="w-[200px] h-[150px] rounded-md relative bg-secondary">
            <PreviewImage
              imagePreview={imagePreview}
              imgClasses="absolute w-[150px] -translate-x-1/2 left-1/2 object-cover"
              setPreview={setImagePreview}
            />
          </div>

          <PlotfieldInput
            placeholder="Название"
            value={emotionName}
            onChange={(e) => setEmotionName(e.target.value)}
            className="text-text opacity-90 flex-grow"
          />
        </div>
        <SheetFooter className="mt-[10px]">
          <SheetClose asChild>
            <Button
              onClick={handleSubmit}
              className="text-text bg-brand-gradient-left hover:opacity-90 active:scale-[.99] transition-all"
              type="submit"
            >
              Создать
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
