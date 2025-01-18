import { Button } from "@/components/ui/button";
import useUpdateCharacteristicTranslation from "@/hooks/Patching/Translation/useUpdateCharacteristicTranslation";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type EditCharacteristicItemTypes = {
  characteristicName?: string;
  characteristicId: string;
  showEditingModal: boolean;
  editingCharacteristicId: string;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCharacteristicName: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function EditCharacteristicItem({
  showEditingModal,
  characteristicName,
  characteristicId,
  editingCharacteristicId,
  setCurrentCharacteristicName,
  setShowEditingModal,
}: EditCharacteristicItemTypes) {
  const { storyId } = useParams();
  const [editingCharacteristicName, setEditingCharacteristicName] = useState(characteristicName);

  useEffect(() => {
    setEditingCharacteristicName(characteristicName);
  }, [showEditingModal, characteristicName]);

  const updateCharacteristic = useUpdateCharacteristicTranslation({
    characterCharacteristicId: characteristicId,
    language: "russian",
    storyId: storyId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCharacteristicName?.trim().length) {
      console.log("Can not save nothing");
      return;
    }

    setCurrentCharacteristicName(editingCharacteristicName);

    setShowEditingModal(false);
    updateCharacteristic.mutate({
      characteristicName: editingCharacteristicName,
    });
    setEditingCharacteristicName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        showEditingModal && editingCharacteristicId === characteristicId ? "" : "hidden"
      } w-full flex flex-col gap-[5px]`}
    >
      <PlotfieldInput
        type="text"
        value={editingCharacteristicName}
        onChange={(e) => setEditingCharacteristicName(e.target.value)}
        className="border-[1px] border-border text-[17px]"
      />
      <div className="flex gap-[5px]">
        <Button
          onClick={() => {
            setShowEditingModal(false);
            setEditingCharacteristicName("");
          }}
          className="text-text flex-grow bg-accent active:scale-[.99] hover:bg-orange transition-all"
          type="button"
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
