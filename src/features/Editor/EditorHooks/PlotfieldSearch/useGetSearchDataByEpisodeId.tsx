import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetSearchDataByEpisodeIdTypes = {
  currentTopologyBlockId: string;
  episodeId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useGetSearchDataByEpisodeId({
  currentTopologyBlockId,
  episodeId,
  language = "russian",
}: GetSearchDataByEpisodeIdTypes) {
  //   const {} = useSearch();

  return useQuery({
    queryKey: ["plotfieldSearch", "episode", episodeId, "rootTopologyBlock", currentTopologyBlockId],
    queryFn: async () =>
      await axiosCustomized
        .get(
          `/plotfieldSearch/episodes/${episodeId}/rootTopologyBlock/${currentTopologyBlockId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
