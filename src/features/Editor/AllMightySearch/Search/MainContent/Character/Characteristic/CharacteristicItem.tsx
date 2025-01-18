import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import useDeleteCharacteristic from "@/hooks/Deleting/Characteristic/useDeleteCharacteristic";
import React from "react";
import { useParams } from "react-router-dom";

type CharacteristicItemTypes = {
  characteristicId: string;
  deletedCharacteristicId: string;
  currentCharacteristicName?: string;
  showEditingModal: boolean;
  setDeletedCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setEditingCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CharacteristicItem({
  characteristicId,
  deletedCharacteristicId,
  currentCharacteristicName,
  showEditingModal,
  setDeletedCharacteristicId,
  setEditingCharacteristicId,
  setShowEditingModal,
}: CharacteristicItemTypes) {
  const { storyId } = useParams();

  const deleteCharacteristic = useDeleteCharacteristic({
    characteristicId,
    currentLanguage: "russian",
    storyId: storyId || "",
  });

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={`${deletedCharacteristicId === characteristicId ? "hidden" : ""} ${
          showEditingModal ? "hidden" : ""
        } w-full relative`}
      >
        <Button
          className={`w-full text-start text-paragraph border-border border-[1px] hover:bg-accent transition-all shadow-sm`}
        >
          {currentCharacteristicName}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setEditingCharacteristicId(characteristicId);
            setShowEditingModal(true);
          }}
        >
          Редактировать
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setDeletedCharacteristicId(characteristicId);
            deleteCharacteristic.mutate();
          }}
        >
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
