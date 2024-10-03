import { useEffect, useState } from "react";
import useGetCharacterById from "../../../hooks/Fetching/Character/useGetCharacterById";
import { TranslationCharacterTypes } from "../../../types/Additional/TranslationTypes";

type EmotionCharacterNameTypes = {
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
} & TranslationCharacterTypes;

export default function EmotionHeaderCharacterNames({
  setCharacterName,
  setCharacterId,
  setShowCharacterModal,
  characterId,
  translations,
}: EmotionCharacterNameTypes) {
  const { data: character } = useGetCharacterById({
    characterId,
  });

  const [currentCharacterName, setCurrentCharacterName] = useState("");

  useEffect(() => {
    if (translations) {
      setCurrentCharacterName((translations || [])[0]?.text || "");
    }
  }, [translations]);

  return (
    <>
      {character?.img ? (
        <button
          onClick={() => {
            setCharacterName(currentCharacterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
          }}
          className="rounded-md flex px-[.5rem] py-[.2rem] items-center justify-between hover:bg-primary-light-blue hover:text-white transition-all "
        >
          <p className="text-[1.3rem] rounded-md">
            {currentCharacterName.length > 20
              ? currentCharacterName.substring(0, 20) + "..."
              : currentCharacterName}
          </p>
          <img
            src={character?.img}
            alt="CharacterImg"
            className="w-[3rem] rounded-md"
          />
        </button>
      ) : (
        <button
          onClick={() => {
            setCharacterName(currentCharacterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
          }}
          className="text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
        >
          {currentCharacterName.length > 20
            ? currentCharacterName.substring(0, 20) + "..."
            : currentCharacterName}
        </button>
      )}
    </>
  );
}
