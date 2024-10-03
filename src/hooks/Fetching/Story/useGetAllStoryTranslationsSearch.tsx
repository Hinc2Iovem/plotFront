import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { StoryFilterTypes } from "../../../features/Story/Story";

export const getAllTranslationStoriesSearch = async ({
  language,
  debouncedValue,
}: {
  language: CurrentlyAvailableLanguagesTypes;
  debouncedValue: string;
}): Promise<TranslationStoryTypes[]> => {
  return await axiosCustomized
    .get<TranslationStoryTypes[]>(
      `/stories/storyStatus/search/translations?currentLanguage=${language}&text=${debouncedValue}`
    )
    .then((r) => r.data);
};

export default function useGetAllStoryTranslationsSearch({
  language,
  storiesType,
  debouncedValue,
}: {
  language: CurrentlyAvailableLanguagesTypes;
  storiesType: StoryFilterTypes;
  debouncedValue: string;
}) {
  return useQuery({
    queryKey: ["translation", "stories", "search", debouncedValue],
    queryFn: () => getAllTranslationStoriesSearch({ debouncedValue, language }),
    select: (data) =>
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    enabled: !!language && storiesType === "all",
  });
}
