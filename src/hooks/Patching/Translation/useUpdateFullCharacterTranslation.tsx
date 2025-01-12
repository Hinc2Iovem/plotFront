import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { SearchCharacterVariationTypes, StoryNewCharacterTypes } from "@/features/Character/CharacterListPage";

type UpdateCharacterTranslationTypes = {
  characterId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateCharacterTranslationOnMutationTypes = {
  debouncedValue: string;
  searchCharacterType: SearchCharacterVariationTypes;
} & StoryNewCharacterTypes;

export default function useUpdateFullCharacterTranslation({
  characterId,
  storyId,
  language,
}: UpdateCharacterTranslationTypes) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterDescription,
      characterImg,
      characterName,
      characterTag,
      characterType,
      characterUnknownName,
    }: UpdateCharacterTranslationOnMutationTypes) =>
      await axiosCustomized.put(`/characters/${characterId}/translations`, {
        currentLanguage: language,
        characterDescription,
        characterImg,
        characterName,
        characterTag,
        characterType,
        characterUnknownName,
      }),
    onSuccess: (_, variables) => {
      const { characterType, searchCharacterType, debouncedValue } = variables;
      if (characterType === "maincharacter") {
        queryClient.invalidateQueries({
          queryKey: ["story", storyId, "character", "mainCharacter"],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["character", characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "character", "type", "story", storyId, "search"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "translation",
          language,
          "character",
          "type",
          searchCharacterType,
          "story",
          storyId,
          "search",
          debouncedValue,
        ],
      });
    },
  });
}
