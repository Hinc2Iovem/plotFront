import { useState } from "react";
import EditEmotionItem from "./EditEmotionItem";
import EmotionItem from "./EmotionItem";

type CharacterEmotionBlockItemTypes = {
  emotionName?: string;
  imgUrl?: string;
  _id: string;
  characterId: string;
  showEditingModal: boolean;
  editingEmotionId: string;
  deletedEmotionId: string;
  setDeletedEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setEditingEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CharacterEmotionBlockItem({
  _id,
  emotionName,
  imgUrl,
  characterId,
  showEditingModal,
  editingEmotionId,
  deletedEmotionId,
  setDeletedEmotionId,
  setEditingEmotionId,
  setShowEditingModal,
}: CharacterEmotionBlockItemTypes) {
  const [currentEmotionName, setCurrentEmotionName] = useState(emotionName);
  const [currentImgUrl, setCurrentImgUrl] = useState(imgUrl);

  return (
    <>
      <EmotionItem
        characterId={characterId}
        currentEmotionName={currentEmotionName || ""}
        currentImgUrl={currentImgUrl}
        deletedEmotionId={deletedEmotionId}
        editingEmotionId={editingEmotionId}
        emotionId={_id}
        setDeletedEmotionId={setDeletedEmotionId}
        setEditingEmotionId={setEditingEmotionId}
        setShowEditingModal={setShowEditingModal}
      />

      <EditEmotionItem
        characterId={characterId}
        editingEmotionId={editingEmotionId}
        emotionId={_id}
        emotionName={emotionName}
        imgUrl={imgUrl}
        setCurrentEmotionName={setCurrentEmotionName}
        setCurrentImgUrl={setCurrentImgUrl}
        setEditingEmotionId={setEditingEmotionId}
        setShowEditingModal={setShowEditingModal}
        showEditingModal={showEditingModal}
      />
    </>
  );
}
