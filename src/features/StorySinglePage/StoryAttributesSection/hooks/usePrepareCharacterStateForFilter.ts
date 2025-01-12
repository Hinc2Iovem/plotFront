import useGetAllCharactersByStoryId from "@/hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "@/hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function usePrepareCharacterStateForFilter({ characterName }: { characterName: string }) {
  const { storyId } = useParams();

  const { data: allTranslatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryId({
    storyId: storyId || "",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
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
      if (characterName?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterName?.toLowerCase().includes(characterName?.trim()?.toLowerCase())
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, characterName]);

  return { filteredCharacters, allCharacters, allTranslatedCharacters };
}
