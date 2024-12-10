import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { SearchItemTypes } from "../../Context/Search/SearchContext";

export type PlotfieldSearchResultTypes = {
  episodeId: string;
  results: SearchItemTypes[];
};

type GetDataForPlotfieldSearchTypes = {
  episodeId: string;
  topologyBlockId: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function useGetDataForPlotfieldSearch({
  currentLanguage,
  episodeId,
  topologyBlockId,
}: GetDataForPlotfieldSearchTypes) {
  return useQuery({
    queryKey: ["plotfieldSearch", "episode", episodeId],
    queryFn: async () =>
      await axiosCustomized
        .get<PlotfieldSearchResultTypes>(
          `/plotfieldSearch/episodes/${episodeId}?topologyBlockId=${topologyBlockId}&currentLanguage=${currentLanguage}`
        )
        .then((r) => r.data),

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!episodeId && !!currentLanguage && !!topologyBlockId,
  });
}
