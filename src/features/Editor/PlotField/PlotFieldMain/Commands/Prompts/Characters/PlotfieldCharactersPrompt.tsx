import { useState } from "react";
import useGetCharacterById from "../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import { TranslationCharacterTypes } from "../../../../../../../types/Additional/TranslationTypes";

type EmotionCharacterNameTypes = {
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setCharacterImg?: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
} & TranslationCharacterTypes;

export default function PlotfieldCharactersPrompt({
  characterId,
  setCharacterName,
  setCharacterId,
  setShowCharacterModal,
  setCharacterImg,
  translations,
}: EmotionCharacterNameTypes) {
  const { data: character } = useGetCharacterById({
    characterId,
  });
  const theme = localStorage.getItem("theme");
  const [currentCharacterName] = useState((translations || [])[0]?.text || "");

  return (
    <>
      {character?.img ? (
        <button
          type="button"
          onClick={() => {
            setCharacterName(currentCharacterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
            if (setCharacterImg) {
              setCharacterImg(character?.img || "");
            }
          }}
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:bg-primary-darker focus-within:text-text-light flex-wrap rounded-md flex px-[1rem] py-[.5rem] items-center justify-between hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          <p className="text-[1.3rem] rounded-md">
            {currentCharacterName.length > 20
              ? currentCharacterName.substring(0, 20) + "..."
              : currentCharacterName}
          </p>
          <img
            src={character?.img || ""}
            alt="CharacterImg"
            className="w-[3rem] rounded-md"
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setCharacterName(currentCharacterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
            if (setCharacterImg) {
              setCharacterImg("");
            }
          }}
          className={`whitespace-nowrap w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-start text-[1.3rem] focus-within:bg-primary-darker focus-within:text-text-light rounded-md px-[1rem] py-[1rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all `}
        >
          {currentCharacterName.length > 20
            ? currentCharacterName.substring(0, 20) + "..."
            : currentCharacterName}
        </button>
      )}
    </>
  );
}
