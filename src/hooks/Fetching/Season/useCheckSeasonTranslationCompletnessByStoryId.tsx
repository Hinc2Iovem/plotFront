import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

type CheckSeasonTranslationCompletnessByStoryIdTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  storyId: string;
};

export default function useCheckSeasonTranslationCompletnessByStoryId({
  currentLanguage,
  storyId,
  translateToLanguage,
}: CheckSeasonTranslationCompletnessByStoryIdTypes) {
  return useQuery({
    queryKey: [
      "completness",
      "translation",
      "from",
      currentLanguage,
      "to",
      translateToLanguage,
      "season",
      "story",
      storyId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<boolean>(
          `/seasons/stories/${storyId}/completness/translations?currentLanguage=${currentLanguage}&translateToLanguage=${translateToLanguage}`
        )
        .then((r) => r.data),
    enabled: !!currentLanguage && !!translateToLanguage && !!storyId,
  });
}
