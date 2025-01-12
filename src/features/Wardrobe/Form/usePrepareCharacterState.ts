import { CharacterValueTypes } from "@/features/Editor/PlotField/PlotFieldMain/Commands/Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useGetCharacterById from "@/hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "@/hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import { useEffect, useState } from "react";

export default function usePrepareCharacterState({ characterId }: { characterId: string }) {
  const [characterValue, setCharacterValue] = useState<CharacterValueTypes>({
    _id: characterId,
    characterName: "",
    imgUrl: "",
  });

  const { data: character } = useGetCharacterById({ characterId: characterId || "" });

  useEffect(() => {
    if (character) {
      setCharacterValue((prev) => ({
        ...prev,
        imgUrl: character?.img || "",
      }));
    }
  }, [character]);

  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: characterId || "",
    language: "russian",
  });

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        if (tc.textFieldName === "characterName") {
          setCharacterValue((prev) => ({
            ...prev,
            characterName: tc?.text || "",
          }));
        }
      });
    }
  }, [translatedCharacter]);

  return { characterValue, setCharacterValue };
}
