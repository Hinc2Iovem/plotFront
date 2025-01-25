import { useEffect, useState } from "react";
import { UnknownCharacterValueTypes } from "../../Prompts/Characters/UnknownCharacters/PlotfieldUnknownCharacterPromptMain";
import useGetCharacterById from "../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacterById from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";

export default function usePrepareCharacterValuesForNameCommand({ characterId }: { characterId: string }) {
  const [characterValue, setCharacterValue] = useState<UnknownCharacterValueTypes>({
    characterUnknownName: "",
    characterName: "",
    characterImg: "",
    characterId: "",
  });

  const { data: character } = useGetCharacterById({
    characterId: characterId ?? "",
  });
  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: characterId ?? "",
    language: "russian",
  });

  useEffect(() => {
    if (character && character.img) {
      setCharacterValue((prev) => ({
        ...prev,
        characterImg: character.img || "",
      }));
    }
  }, [character]);

  useEffect(() => {
    if (translatedCharacter) {
      translatedCharacter.translations?.map((tc) => {
        setCharacterValue((prev) => ({
          ...prev,
          characterName: tc.textFieldName === "characterName" ? tc.text : prev.characterName,
          characterUnknownName: tc.textFieldName === "characterUnknownName" ? tc.text : prev.characterUnknownName,
        }));
      });
    }
  }, [translatedCharacter]);

  return { characterValue, setCharacterValue };
}
