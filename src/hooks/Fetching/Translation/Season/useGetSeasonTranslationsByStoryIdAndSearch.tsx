import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { TranslationSeasonTypes } from "../../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

export default function useGetSeasonTranslationsByStoryIdAndSearch({
  debouncedValue,
  language,
  storyId,
}: {
  debouncedValue?: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      language,
      "textFieldName",
      "story",
      storyId,
      "search",
      debouncedValue,
      "season",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationSeasonTypes[]>(
          `/seasons/stories/search/translations?currentLanguage=${language}&storyId=${storyId}&text=${debouncedValue}`
        )
        .then((r) => r.data),
    enabled: !!language && !!storyId,
  });
}
