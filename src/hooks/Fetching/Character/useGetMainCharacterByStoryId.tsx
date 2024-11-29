import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetMainCharacterByStoryIdTypes = {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type ResponseCharacterTypes = {
  characterId: string;
  characterImg?: string;
  characterName: string;
};

export default function useGetMainCharacterByStoryId({ storyId, language }: GetMainCharacterByStoryIdTypes) {
  return useQuery({
    queryKey: ["story", storyId, "character", "mainCharacter"],
    queryFn: async () =>
      await axiosCustomized
        .get<ResponseCharacterTypes>(`/characters/stories/${storyId}/mainCharacter?currentLanguage=${language}`)
        .then((r) => r.data),
    enabled: !!storyId && !!language,
  });
}
