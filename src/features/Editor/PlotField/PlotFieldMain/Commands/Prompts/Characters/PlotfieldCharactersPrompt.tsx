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
          className="whitespace-nowrap w-full outline-gray-300 flex-wrap rounded-md flex px-[1rem] py-[.5rem] items-center justify-between hover:bg-primary-light-blue hover:text-white transition-all "
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
          className="whitespace-nowrap w-full outline-gray-300 flex-wrap text-start text-[1.3rem] px-[1rem] py-[.5rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
        >
          {currentCharacterName.length > 20
            ? currentCharacterName.substring(0, 20) + "..."
            : currentCharacterName}
        </button>
      )}
    </>
  );
}
