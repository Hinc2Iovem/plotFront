import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { TranslationStoryTypes } from "../../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetTranslationStoriesSearchTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  debouncedValue?: string;
};

export default function useGetTranslationStoriesSearch({
  language,
  debouncedValue,
}: GetTranslationStoriesSearchTypes) {
  return useQuery({
    queryKey: ["translation", language, "story", "search", debouncedValue],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationStoryTypes[]>(
          `/stories/storyStatus/search/translations?currentLanguage=${language}&text=${debouncedValue}`
        )
        .then((r) => r.data),
    enabled: !!language,
  });
}
