import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";

export const getAllAssignedStories = async ({
  language,
  debouncedValue,
  storyStatus,
  staffId,
}: {
  language: CurrentlyAvailableLanguagesTypes;
  storyStatus: string;
  debouncedValue: string;
  staffId: string;
}): Promise<TranslationStoryTypes[]> => {
  return await axiosCustomized
    .get<TranslationStoryTypes[]>(
      `/stories/staff/${staffId}/search/translations?currentLanguage=${language}&text=${debouncedValue}&storyStatus=${storyStatus}`
    )
    .then((r) => r.data);
};

export default function useGetAllAssignedStoryTranslationsSearch({
  language,
  debouncedValue,
  storyStatus,
  staffId,
  startFetching,
}: {
  language: CurrentlyAvailableLanguagesTypes;
  storyStatus: string;
  debouncedValue: string;
  staffId: string;
  startFetching: boolean;
}) {
  return useQuery({
    queryKey: [
      "translation",
      "assigned",
      "stories",
      storyStatus,
      staffId,
      "search",
      debouncedValue,
    ],
    queryFn: () =>
      getAllAssignedStories({
        debouncedValue,
        language,
        staffId,
        storyStatus: storyStatus,
      }),
    select: (data) =>
      data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    enabled: !!language && startFetching,
  });
}
