import { useEffect, useState } from "react";
import useGetCharacterById from "../../../../../../hooks/Fetching/Character/useGetCharacterById";
import { CharacterValueTypes } from "../../../PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useGetTranslationCharacterById from "../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";

type GetCharacterWithTranslationTypes = {
  currentCharacterId?: string;
};

export default function useGetCharacterWithTranslation({ currentCharacterId }: GetCharacterWithTranslationTypes) {
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: currentCharacterId || null,
    characterName: null,
    imgUrl: null,
  });

  const { data: currentCharacter } = useGetCharacterById({ characterId: characterValue._id || "" });
  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: characterValue._id || "",
    language: "russian",
  });

  useEffect(() => {
    if (currentCharacter && characterValue.imgUrl !== currentCharacter.img) {
      setCharacterValue((prev) => ({
        ...prev,
        imgUrl: currentCharacter?.img || "",
      }));
    }
  }, [currentCharacter]);

  useEffect(() => {
    if (translatedCharacter && characterValue.characterName !== (translatedCharacter?.translations || [])[0]?.text) {
      setCharacterValue((prev) => ({
        ...prev,
        characterName: (translatedCharacter?.translations || [])[0].text || "",
      }));
    }
  }, [translatedCharacter]);

  return { characterValue, setCharacterValue };
}
