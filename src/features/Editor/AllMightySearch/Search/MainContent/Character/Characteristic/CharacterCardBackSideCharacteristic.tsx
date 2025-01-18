import { Button } from "@/components/ui/button";
import { CharacterTypes } from "@/types/StoryData/Character/CharacterTypes";
import { useState } from "react";
import { FinedCharacteristicTypes } from "../AllMightySearchMainContentCharacter";
import CharacterCardCreateCharacteristicForm from "./CharacterCardCreateCharacteristicForm";
import CharacterCharacteristicBlockItem from "./CharacterCharacteristicBlockItem";

type CharacterCharacteristicsBlockTypes = {
  characterType: CharacterTypes;
  characteristics: FinedCharacteristicTypes[];
};

export function CharacterCharacteristicsBlock({ characterType, characteristics }: CharacterCharacteristicsBlockTypes) {
  const [newCharacteristic, setNewCharacteristic] = useState<FinedCharacteristicTypes | null>(null);
  const [beginCreatingNewCharacteristic, setBeginCreatingNewCharacteristic] = useState(false);

  const [deletedCharacteristicId, setDeletedCharacteristicId] = useState("");
  const [editingCharacteristicId, setEditingCharacteristicId] = useState("");
  const [showEditingCharacteristic, setShowEditingCharacteristic] = useState(false);

  return (
    <div
      className={` ${
        characterType === "maincharacter" ? "" : "hidden"
      } flex flex-col gap-[5px] bg-secondary pt-[5px] rounded-md px-[5px]`}
    >
      <div className="flex justify-between w-full items-center p-[5px]">
        <h3 className="text-heading text-[20px]">Характеристики</h3>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setNewCharacteristic(null);
            setBeginCreatingNewCharacteristic(true);
          }}
          className="text-white bg-brand-gradient transition-all hover:scale-[1.02] hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[1]"
        >
          + Характеристика
        </Button>
      </div>

      <CharacterCardCreateCharacteristicForm
        beginCreatingNewCharacteristic={beginCreatingNewCharacteristic}
        characteristics={characteristics}
        newCharacteristic={newCharacteristic}
        setBeginCreatingNewCharacteristic={setBeginCreatingNewCharacteristic}
        setNewCharacteristic={setNewCharacteristic}
      />

      <div
        className={`${
          beginCreatingNewCharacteristic ? "hidden" : ""
        } w-full p-[5px] overflow-auto h-[150px] rounded-md flex flex-col gap-[5px] | containerScroll`}
      >
        {characteristics.map((c) => (
          <CharacterCharacteristicBlockItem
            key={c._id}
            _id={c._id}
            deletedCharacteristicId={deletedCharacteristicId}
            editingCharacteristicId={editingCharacteristicId}
            characteristicId={c.characteristicId}
            setDeletedCharacteristicId={setDeletedCharacteristicId}
            setEditingCharacteristicId={setEditingCharacteristicId}
            setShowEditingModal={setShowEditingCharacteristic}
            showEditingModal={showEditingCharacteristic}
            characteristicName={c.characteristicText}
          />
        ))}
      </div>
    </div>
  );
}
