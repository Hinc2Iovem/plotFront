import useGetAllCharactersByStoryIdAndType from "@/hooks/Fetching/Character/useGetAllCharactersByStoryIdAndType";
import useGetTranslationCharactersByStoryIdAndType from "@/hooks/Fetching/Translation/Characters/useGetTranslationCharactersByStoryIdAndType";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function useUnknownCharactersHandleLogic({ characterUnknownName }: { characterUnknownName?: string }) {
  const { storyId } = useParams();

  const { data: allTranslatedCharacters } = useGetTranslationCharactersByStoryIdAndType({
    storyId: storyId || "",
    language: "russian",
    type: "minorcharacter",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryIdAndType({
    storyId: storyId || "",
    searchCharacterType: "minorcharacter",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
          characterUnknownName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterUnknownName")?.text ||
            "",
          characterName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterName")?.text || "",
        };
      });
    } else {
      return [];
    }
  }, [allTranslatedCharacters, allCharacters]);

  const filteredCharacters = useMemo(() => {
    if (combinedCharacters) {
      if (characterUnknownName?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterUnknownName?.toLowerCase().includes(characterUnknownName?.toLowerCase())
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, characterUnknownName]);

  return { filteredCharacters, allTranslatedCharacters, allCharacters };
}
