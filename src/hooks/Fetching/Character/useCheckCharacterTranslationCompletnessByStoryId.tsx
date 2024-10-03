import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

type CheckCharacterTranslationCompletnessByStoryIdTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  characterType?: string;
  storyId: string;
};

export default function useCheckCharacterTranslationCompletnessByStoryId({
  characterType,
  currentLanguage,
  storyId,
  translateToLanguage,
}: CheckCharacterTranslationCompletnessByStoryIdTypes) {
  return useQuery({
    queryKey: [
      "completness",
      "translation",
      "from",
      currentLanguage,
      "to",
      translateToLanguage,
      "character",
      characterType,
      "story",
      storyId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<boolean>(
          `/characters/stories/${storyId}/completness/translations?currentLanguage=${currentLanguage}&translateToLanguage=${translateToLanguage}&characterType=${characterType}`
        )
        .then((r) => r.data),
    enabled: !!currentLanguage && !!translateToLanguage && !!storyId,
  });
}
