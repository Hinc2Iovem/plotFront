import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import useCreateEmotion from "@/hooks/Posting/Emotion/useCreateEmotion";
import useOutOfModal from "@/hooks/UI/useOutOfModal";
import { EmotionsTypes } from "@/types/StoryData/Character/CharacterTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import PreviewImageSmallIcons from "@/ui/shared/PreviewImageSmallIcons";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useRef, useState } from "react";
import { toast } from "sonner";

type CharacterCardCreateEmotionFormTypes = {
  emotions: EmotionsTypes[];
  characterId: string;
  beginCreatingNewEmotion: boolean;
  setBeginCreatingNewEmotion: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CharacterCardCreateEmotionForm({
  characterId,
  emotions,
  beginCreatingNewEmotion,
  setBeginCreatingNewEmotion,
}: CharacterCardCreateEmotionFormTypes) {
  const [newEmotion, setNewEmotion] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null | ArrayBuffer>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const createEmotion = useCreateEmotion({ characterId });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmotion?.trim().length) {
      toast("Заполните поле", toastErrorStyles);
      return;
    }

    const emotionId = generateMongoObjectId();

    setBeginCreatingNewEmotion(false);

    emotions.push({
      _id: emotionId,
      emotionName: newEmotion,
      imgUrl: imagePreview as string,
    });
    createEmotion.mutate({ emotionId, emotionBodyName: newEmotion, imgUrl: imagePreview as string });
    toast("Эмоция создана", toastSuccessStyles);
  };

  useOutOfModal({
    modalRef,
    setShowModal: setBeginCreatingNewEmotion,
    showModal: beginCreatingNewEmotion,
  });

  return (
    <div
      ref={modalRef}
      className={`${
        beginCreatingNewEmotion ? "" : "hidden"
      } w-full p-[5px] overflow-auto h-full rounded-md flex flex-col gap-[5px] | containerScroll`}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[10px]">
        <div className="flex gap-[5px] w-full items-center">
          <PlotfieldInput
            className="border-[1px] text-[17px] flex-grow"
            value={newEmotion}
            placeholder="Эмоция"
            onChange={(e) => setNewEmotion(e.target.value)}
          />
          <div className={`w-[40px] relative bg-primary rounded-md h-[40px] flex-shrink-0`}>
            <PreviewImageSmallIcons
              imagePreview={imagePreview}
              divClasses="bg-accent relative w-[40px] h-full rounded-md hover:opacity-80 transition-all"
              imgClasses="w-[80%] rounded-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
              setPreview={setImagePreview}
              imgNotExistingClasses="w-[80%] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            />
          </div>
        </div>

        <div className="flex justify-between gap-[5px]">
          <Button
            type="button"
            onClick={() => setBeginCreatingNewEmotion(false)}
            className="flex-grow self-end bg-accent text-text hover:opacity-80 hover:scale-[1.02] active:scale-[1] transition-all"
          >
            Назад
          </Button>
          <Button className="flex-grow self-end bg-accent text-text hover:bg-green hover:scale-[1.02] active:scale-[1] transition-all">
            Создать
          </Button>
        </div>
      </form>
    </div>
  );
}
