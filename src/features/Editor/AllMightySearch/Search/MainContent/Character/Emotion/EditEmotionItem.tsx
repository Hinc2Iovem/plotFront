import { Button } from "@/components/ui/button";
import useUpdateEmotion from "@/hooks/Posting/Emotion/useUpdateEmotion";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import PreviewImageSmallIcons from "@/ui/shared/PreviewImageSmallIcons";
import { useEffect, useState } from "react";

type EditEmotionItemTypes = {
  emotionName?: string;
  characterId: string;
  imgUrl?: string;
  emotionId: string;
  showEditingModal: boolean;
  editingEmotionId: string;
  setCurrentEmotionName: React.Dispatch<React.SetStateAction<string | undefined>>;
  setCurrentImgUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  setEditingEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditEmotionItem({
  characterId,
  emotionId,
  emotionName,
  imgUrl,
  editingEmotionId,
  setCurrentEmotionName,
  setCurrentImgUrl,
  setEditingEmotionId,
  setShowEditingModal,
  showEditingModal,
}: EditEmotionItemTypes) {
  const [editingEmotionName, setEditingEmotionName] = useState(emotionName);
  const [imagePreview, setImagePreview] = useState<null | string | ArrayBuffer>(imgUrl || null);

  const updateEmotion = useUpdateEmotion({ characterId, emotionId });

  useEffect(() => {
    setEditingEmotionName(emotionName);
  }, [showEditingModal, emotionName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmotionName?.trim().length) {
      console.log("Can not save nothing");
      return;
    }

    setCurrentEmotionName(editingEmotionName);
    if (typeof imagePreview === "string" && imagePreview?.trim().length) {
      setCurrentImgUrl(imagePreview);
    }

    setShowEditingModal(false);
    updateEmotion.mutate({ emotionImg: typeof imagePreview === "string" ? imagePreview : "", emotionName });
    setEditingEmotionId("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${showEditingModal && editingEmotionId === emotionId ? "" : "hidden"} w-full flex flex-col gap-[5px]`}
    >
      <div className="flex gap-[5px]">
        <PlotfieldInput
          type="text"
          value={editingEmotionName}
          onChange={(e) => setEditingEmotionName(e.target.value)}
          className="border-[1px] border-border text-[17px]"
        />
        <div className={`w-[40px] relative bg-primary rounded-md h-[40px] flex-shrink-0`}>
          <PreviewImageSmallIcons
            imagePreview={imagePreview}
            imgClasses="rounded-md border-[2px] border-primary"
            setPreview={setImagePreview}
            imgNotExistingClasses="w-[30px] absolute left-[5px] top-[5px]"
          />
        </div>
      </div>
      <div className="flex gap-[5px]">
        <Button
          onClick={() => {
            setShowEditingModal(false);
            setEditingEmotionId("");
          }}
          type="button"
          className="text-text flex-grow bg-accent active:scale-[.99] hover:bg-orange transition-all"
        >
          Закрыть
        </Button>
        <Button
          type="submit"
          className="text-text flex-grow bg-accent active:scale-[.99] hover:bg-green transition-all"
        >
          Изменить
        </Button>
      </div>
    </form>
  );
}
