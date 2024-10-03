import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

type CheckCharacteristicTranslationCompletnessByStoryIdTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  storyId: string;
};

export default function useCheckCharacteristicTranslationCompletnessByStoryId({
  currentLanguage,
  storyId,
  translateToLanguage,
}: CheckCharacteristicTranslationCompletnessByStoryIdTypes) {
  return useQuery({
    queryKey: [
      "completness",
      "translation",
      "from",
      currentLanguage,
      "to",
      translateToLanguage,
      "characteristic",
      "story",
      storyId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<boolean>(
          `/characteristics/stories/${storyId}/completness/translations?currentLanguage=${currentLanguage}&translateToLanguage=${translateToLanguage}`
        )
        .then((r) => r.data),
    enabled: !!currentLanguage && !!translateToLanguage && !!storyId,
  });
}
