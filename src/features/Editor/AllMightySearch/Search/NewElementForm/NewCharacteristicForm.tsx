import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { TranslationTextFieldName } from "../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useCreateCharacteristicOptimistic from "../../../../../hooks/Posting/Characteristic/useCreateCharacteristicOptimistic";
import { TranslationCharacterCharacteristicTypes } from "../../../../../types/Additional/TranslationTypes";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import PlotfieldButton from "../../../../shared/Buttons/PlotfieldButton";
import PlotfieldInput from "../../../../shared/Inputs/PlotfieldInput";

type NewCharacteristicFormTypes = {
  setNewElement: React.Dispatch<React.SetStateAction<TranslationCharacterCharacteristicTypes>>;
  showCreatingNewElement: boolean;
  setShowCreatingNewElement: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewCharacteristicForm({
  setNewElement,
  setShowCreatingNewElement,
  showCreatingNewElement,
}: NewCharacteristicFormTypes) {
  const { storyId } = useParams();
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && showCreatingNewElement) {
      inputRef.current.focus();
    }
  }, [inputRef, showCreatingNewElement]);

  const createNewCharacteristic = useCreateCharacteristicOptimistic({ storyId: storyId || "", language: "russian" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value?.trim().length) {
      console.log("Can not crete an empty characteristic");
      return;
    }
    const characteristicId = generateMongoObjectId();
    setNewElement({
      _id: "",
      translations: [
        {
          _id: "",
          amountOfWords: value?.length || 0,
          text: value,
          textFieldName: TranslationTextFieldName.CharacterCharacteristic as "characterCharacteristic",
        },
      ],
      language: "russian",
      storyId: storyId || "",
      characteristicId: characteristicId,
      commandId: "",
      createdAt: new Date(new Date().getTime()),
      updatedAt: new Date(new Date().getTime()),
      topologyBlockId: "",
    } as TranslationCharacterCharacteristicTypes);

    setShowCreatingNewElement(false);
    createNewCharacteristic.mutate({ characteristicNameBody: value, characteristicId });
  };
  useEffect(() => {
    if (showCreatingNewElement) {
      setValue("");
    }
  }, [showCreatingNewElement]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem]">
      <PlotfieldInput
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        className="border-[.1rem]"
        placeholder="Характеристика"
      />
      <PlotfieldButton className="w-fit self-end bg-primary-darker">Создать</PlotfieldButton>
    </form>
  );
}
