import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateMainCharacterByStoryIdTypes = {
  characterId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateMainCharacterByStoryId({
  characterId,
  language,
  storyId,
}: UpdateMainCharacterByStoryIdTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/characters/${characterId}/stories/${storyId}/mainCharacter?currentLanguage=${language}`
      ),
  });
}
