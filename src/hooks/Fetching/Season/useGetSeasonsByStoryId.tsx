import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../types/Additional/TranslationTypes";
import { getEpisodesBySeasonId } from "../Episode/useGetEpisodesBySeasonId";

type GetSeasonsByStoryIdTypes = {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export const getSeasonsByStoryId = async ({
  storyId,
  language,
}: GetSeasonsByStoryIdTypes) => {
  return await axiosCustomized
    .get<TranslationSeasonTypes[]>(
      `/seasons/stories/${storyId}/translations?currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetSeasonsByStoryId({
  storyId,
  language,
}: GetSeasonsByStoryIdTypes) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["stories", storyId, "season", "language", language],
    queryFn: async () => {
      const seasons = await getSeasonsByStoryId({ language, storyId });
      for (const s of seasons) {
        queryClient.prefetchQuery({
          queryKey: ["episodes", "seasons", s._id],
          queryFn: () => getEpisodesBySeasonId({ seasonId: s._id }),
        });
      }

      return seasons;
    },
    enabled: !!storyId && !!language,
  });
}
