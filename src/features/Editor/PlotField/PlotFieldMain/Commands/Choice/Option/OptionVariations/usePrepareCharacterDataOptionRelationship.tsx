import { useEffect } from "react";
import useGetTranslationCharacterById from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import { CharacterValueTypes } from "../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type PrepareCharacterDataOptionRelationshipTypes = {
  characterValue: CharacterValueTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
};

export default function usePrepareCharacterDataOptionRelationship({
  characterValue,
  setCharacterValue,
}: PrepareCharacterDataOptionRelationshipTypes) {
  const { data: character } = useGetCharacterById({ characterId: characterValue._id || "" });

  useEffect(() => {
    if (character) {
      setCharacterValue((prev) => ({
        ...prev,
        imgUrl: character?.img || "",
      }));
    }
  }, [character]);

  const { data: translatedCharacter } = useGetTranslationCharacterById({
    characterId: characterValue._id || "",
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
}
