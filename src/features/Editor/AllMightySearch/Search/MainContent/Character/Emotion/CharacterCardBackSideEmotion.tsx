import { Button } from "@/components/ui/button";
import { EmotionsTypes } from "@/types/StoryData/Character/CharacterTypes";
import { useState } from "react";
import CharacterCardCreateEmotionForm from "./CharacterCardCreateEmotionForm";
import CharacterEmotionBlockItem from "./CharacterEmotionBlockItem";

type CharacterEmotionBlockTypes = {
  emotions: EmotionsTypes[];
  characterId: string;
};

export function CharacterEmotionBlock({ emotions, characterId }: CharacterEmotionBlockTypes) {
  const [beginCreatingNewEmotion, setBeginCreatingNewEmotion] = useState(false);

  const [deletedEmotionId, setDeletedEmotionId] = useState("");
  const [editingEmotionId, setEditingEmotionId] = useState("");
  const [showEditingModal, setShowEditingModal] = useState(false);

  return (
    <div className="flex flex-col gap-[5px] bg-secondary pt-[5px] rounded-md px-[5px]">
      <div className="flex justify-between w-full items-center p-[5px]">
        <h3 className="text-heading text-[20px]">Эмоции</h3>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setBeginCreatingNewEmotion(true);
          }}
          className="text-white bg-brand-gradient transition-all hover:scale-[1.02] hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[1]"
        >
          + Эмоция
        </Button>
      </div>

      <CharacterCardCreateEmotionForm
        beginCreatingNewEmotion={beginCreatingNewEmotion}
        characterId={characterId}
        emotions={emotions}
        setBeginCreatingNewEmotion={setBeginCreatingNewEmotion}
      />

      <div
        className={`${
          beginCreatingNewEmotion ? "hidden" : ""
        } w-full p-[5px] overflow-auto h-[150px] rounded-md flex flex-col gap-[5px] | containerScroll`}
      >
        {emotions.map((e) => (
          <CharacterEmotionBlockItem
            key={e._id}
            deletedEmotionId={deletedEmotionId}
            setDeletedEmotionId={setDeletedEmotionId}
            characterId={characterId}
            editingEmotionId={editingEmotionId}
            setEditingEmotionId={setEditingEmotionId}
            setShowEditingModal={setShowEditingModal}
            showEditingModal={showEditingModal}
            {...e}
          />
        ))}
      </div>
    </div>
  );
}
