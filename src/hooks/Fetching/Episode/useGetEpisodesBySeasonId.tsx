import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { EpisodeTypes } from "../../../types/StoryData/Episode/EpisodeTypes";
import { getTranslationEpisode } from "../Translation/useGetTranslationEpisode";

type GetEpisodesBySeasonIdTypes = {
  seasonId: string;
};

export const getEpisodesBySeasonId = async ({
  seasonId,
}: GetEpisodesBySeasonIdTypes) => {
  return await axiosCustomized
    .get<EpisodeTypes[]>(`/episodes/seasons/${seasonId}`)
    .then((r) => r.data);
};

export default function useGetEpisodesBySeasonId({
  seasonId,
}: GetEpisodesBySeasonIdTypes) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["episodes", "seasons", seasonId],
    queryFn: async () => {
      const episodes = await getEpisodesBySeasonId({ seasonId });

      for (const e of episodes) {
        queryClient.prefetchQuery({
          queryKey: ["translation", "russian", "episode", e._id],
          queryFn: () =>
            getTranslationEpisode({ episodeId: e._id, language: "russian" }),
        });
      }
      return episodes;
    },
    select: (data) => data.sort((a, b) => a.episodeOrder - b.episodeOrder),
    enabled: !!seasonId,
  });
}
