import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { SearchCharacterVariationTypes } from "../../../features/Character/CharacterListPage";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { CharacterGetTypes, CharacterTypes } from "../../../types/StoryData/Character/CharacterTypes";

type CreateCharacterTypes = {
  searchCharacterType?: SearchCharacterVariationTypes;
  storyId: string;
  unknownName?: string;
  description?: string;
  name: string;
  nameTag?: string;
  characterType: CharacterTypes;
  language?: CurrentlyAvailableLanguagesTypes;
  debouncedValue: string;
};

type CreateCharacterBodyTypes = {
  characterId?: string;
  img?: string;
};

export default function useCreateCharacter({
  searchCharacterType,
  storyId,
  unknownName,
  description,
  name,
  nameTag,
  characterType,
  language = "russian",
  debouncedValue,
}: CreateCharacterTypes) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["story", storyId, "new", "character", name],
    mutationFn: async ({ characterId, img }: CreateCharacterBodyTypes) =>
      await axiosCustomized
        .post<CharacterGetTypes>(`/characters/stories/${storyId}`, {
          name,
          currentLanguage: language,
          unknownName,
          description,
          nameTag,
          type: characterType.toLowerCase(),
          characterId,
          img,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "character", "type", "story", storyId, "search"],
        exact: true,
        type: "active",
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
        exact: true,
        type: "active",
      });
    },
  });
}
