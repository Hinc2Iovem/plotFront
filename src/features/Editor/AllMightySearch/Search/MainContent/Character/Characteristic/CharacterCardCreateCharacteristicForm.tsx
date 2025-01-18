import { toastErrorStyles, toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import useCreateCharacteristicOptimistic from "@/hooks/Posting/Characteristic/useCreateCharacteristicOptimistic";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { FinedCharacteristicTypes } from "../AllMightySearchMainContentCharacter";

type CharacterCardCreateCharacteristicFormTypes = {
  beginCreatingNewCharacteristic: boolean;
  characteristics: FinedCharacteristicTypes[];
  newCharacteristic: FinedCharacteristicTypes | null;
  setNewCharacteristic: React.Dispatch<React.SetStateAction<FinedCharacteristicTypes | null>>;
  setBeginCreatingNewCharacteristic: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CharacterCardCreateCharacteristicForm({
  beginCreatingNewCharacteristic,
  newCharacteristic,
  characteristics,
  setBeginCreatingNewCharacteristic,
  setNewCharacteristic,
}: CharacterCardCreateCharacteristicFormTypes) {
  const { storyId } = useParams();

  const createCharacteristic = useCreateCharacteristicOptimistic({ language: "russian", storyId: storyId || "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacteristic?.characteristicText?.trim().length) {
      toast("Заполните поле", toastErrorStyles);
      return;
    }

    const _id = generateMongoObjectId();
    const characteristicId = generateMongoObjectId();

    setNewCharacteristic((prev) => {
      if (prev !== null) {
        return {
          _id,
          characteristicId,
          characteristicText: prev.characteristicText,
        };
      } else {
        return null;
      }
    });

    setBeginCreatingNewCharacteristic(false);

    characteristics.push(newCharacteristic);
    createCharacteristic.mutate({ characteristicId, characteristicNameBody: newCharacteristic.characteristicText });
    toast("Характеристика была создана", toastSuccessStyles);
  };

  return (
    <div
      className={`${
        beginCreatingNewCharacteristic ? "" : "hidden"
      } w-full p-[5px] overflow-auto h-full rounded-md flex flex-col gap-[5px] | containerScroll`}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[10px]">
        <PlotfieldInput
          className="border-[1px] text-[17px] flex-grow"
          value={newCharacteristic?.characteristicText}
          placeholder="Характеристика"
          onChange={(e) =>
            setNewCharacteristic((prev) => {
              if (prev !== null) {
                return {
                  _id: prev?._id || "",
                  characteristicId: prev?.characteristicId || "",
                  characteristicText: e.target.value,
                };
              } else {
                return {
                  _id: "",
                  characteristicId: "",
                  characteristicText: e.target.value,
                };
              }
            })
          }
        />
        <div className="flex justify-between gap-[5px]">
          <Button
            type="button"
            onClick={() => setBeginCreatingNewCharacteristic(false)}
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
