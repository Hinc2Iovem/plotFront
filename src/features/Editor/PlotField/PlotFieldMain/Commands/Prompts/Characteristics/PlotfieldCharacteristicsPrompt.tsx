import { useEffect, useState } from "react";
import { TranslationCharacterCharacteristicTypes } from "../../../../../../../types/Additional/TranslationTypes";

type EmotionCharacteristicNameTypes = {
  setCharacteristicName: React.Dispatch<React.SetStateAction<string>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacteristicModal: React.Dispatch<React.SetStateAction<boolean>>;
} & TranslationCharacterCharacteristicTypes;

export default function PlotfieldCharacteristicsPrompt({
  characteristicId,
  setCharacteristicName,
  setCharacteristicId,
  setShowCharacteristicModal,
  translations,
}: EmotionCharacteristicNameTypes) {
  const [currentCharacteristicName, setCurrentCharacteristicName] =
    useState("");
  const theme = localStorage.getItem("theme");
  useEffect(() => {
    if (translations) {
      translations.map((tc) => {
        if (tc.textFieldName === "characterCharacteristic") {
          setCurrentCharacteristicName(tc.text);
        }
      });
    }
  }, [translations]);

  return (
    <button
      type="button"
      onClick={() => {
        setCharacteristicName(currentCharacteristicName);
        setCharacteristicId(characteristicId);
        setShowCharacteristicModal(false);
      }}
      className={`whitespace-nowrap w-full ${
        theme === "light" ? "outline-gray-300" : "outline-gray-600"
      } flex-wrap text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-darker hover:text-text-light text-text-dark focus-within:text-text-light focus-within:bg-primary-darker transition-all rounded-md`}
    >
      {currentCharacteristicName.length > 20
        ? currentCharacteristicName.substring(0, 20) + "..."
        : currentCharacteristicName}
    </button>
  );
}
