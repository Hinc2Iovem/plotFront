import { useState } from "react";
import CharacteristicItem from "./CharacteristicItem";
import EditCharacteristicItem from "./EditCharacteristicItem";

type CharacterCharacteristicBlockItemTypes = {
  _id: string;
  characteristicId: string;
  showEditingModal: boolean;
  characteristicName?: string;
  editingCharacteristicId: string;
  deletedCharacteristicId: string;
  setDeletedCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setEditingCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setShowEditingModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CharacterCharacteristicBlockItem({
  characteristicName,
  characteristicId,
  showEditingModal,
  editingCharacteristicId,
  deletedCharacteristicId,
  setDeletedCharacteristicId,
  setEditingCharacteristicId,
  setShowEditingModal,
}: CharacterCharacteristicBlockItemTypes) {
  const [currentCharacteristicName, setCurrentCharacteristicName] = useState(characteristicName);

  return (
    <>
      <CharacteristicItem
        characteristicId={characteristicId}
        currentCharacteristicName={currentCharacteristicName}
        deletedCharacteristicId={deletedCharacteristicId}
        setDeletedCharacteristicId={setDeletedCharacteristicId}
        setEditingCharacteristicId={setEditingCharacteristicId}
        setShowEditingModal={setShowEditingModal}
        showEditingModal={showEditingModal}
      />

      <EditCharacteristicItem
        characteristicId={characteristicId}
        editingCharacteristicId={editingCharacteristicId}
        setCurrentCharacteristicName={setCurrentCharacteristicName}
        setShowEditingModal={setShowEditingModal}
        showEditingModal={showEditingModal}
        characteristicName={characteristicName}
      />
    </>
  );
}
