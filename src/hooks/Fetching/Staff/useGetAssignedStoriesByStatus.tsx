import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StoryFilterTypes } from "../../../features/Story/Story";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";

export default function useGetAssignedStoriesByStatus({
  staffId,
  language,
  storyStatus,
  text,
}: {
  staffId: string;
  language: CurrentlyAvailableLanguagesTypes;
  storyStatus: StoryFilterTypes;
  text: string;
}) {
  return useQuery({
    queryKey: [
      "assignedStories",
      "staff",
      staffId,
      "status",
      storyStatus,
      text,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationStoryTypes[]>(
          `/translations/textFieldNames/stories/staff/${staffId}/textFieldNames/status/search?currentLanguage=${language}&storyStatus=${storyStatus}&text=${text}`
        )
        .then((r) => r.data),
    enabled: !!staffId && !!storyStatus,
  });
}
