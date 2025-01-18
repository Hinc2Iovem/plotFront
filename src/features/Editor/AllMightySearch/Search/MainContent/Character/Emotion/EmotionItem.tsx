import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import useDeleteEmotion from "@/hooks/Posting/Emotion/useDeleteEmotion";

type EmotionItemTypes = {
  characterId: string;
  emotionId: string;
  editingEmotionId: string;
  deletedEmotionId: string;
  currentEmotionName: string;
  currentImgUrl?: string;
  setEditingEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setDeletedEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EmotionItem({
  characterId,
  deletedEmotionId,
  editingEmotionId,
  emotionId,
  currentEmotionName,
  currentImgUrl,
  setDeletedEmotionId,
  setEditingEmotionId,
  setShowEditingModal,
}: EmotionItemTypes) {
  const deleteEmotion = useDeleteEmotion({ characterId, emotionId: emotionId });

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={`
        ${editingEmotionId ? "hidden" : ""}
        ${deletedEmotionId === emotionId ? "hidden" : ""}
        `}
      >
        <Button
          className={`flex justify-between w-full items-center text-paragraph border-border border-[1px] hover:bg-accent transition-all shadow-sm`}
        >
          {currentEmotionName}
          {currentImgUrl?.trim().length ? (
            <img src={currentImgUrl} alt={"EmotionImg"} className="w-[30px] object-cover rounded-md" />
          ) : null}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setEditingEmotionId(emotionId);
            setShowEditingModal(true);
          }}
        >
          Редактировать
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setDeletedEmotionId(emotionId);
            deleteEmotion.mutate();
          }}
        >
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
