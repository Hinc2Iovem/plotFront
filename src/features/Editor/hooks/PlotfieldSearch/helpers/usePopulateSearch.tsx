import { useParams } from "react-router-dom";
import useSearch from "../../../Context/Search/SearchContext";
import useGetDataForPlotfieldSearch from "../useGetDataForPlotfieldSearch";
import { useEffect } from "react";

export default function usePopulateSearch({ currentTopologyBlockId }: { currentTopologyBlockId: string }) {
  const { episodeId } = useParams();
  const { addItem } = useSearch();

  const { data } = useGetDataForPlotfieldSearch({
    episodeId: episodeId || "",
    currentLanguage: "russian",
    topologyBlockId: currentTopologyBlockId,
  });

  useEffect(() => {
    if (data) {
      const episodeId = data.episodeId;
      for (const r of data.results) {
        addItem({ episodeId, item: r });
      }
    }
  }, [data]);
}
