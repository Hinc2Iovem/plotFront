import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TopologyBlockTypes } from "../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetTopologyBlockTypes = {
  episodeId: string;
};

export default function useGetFirstTopologyBlockByEpisodeId({
  episodeId,
}: GetTopologyBlockTypes) {
  return useQuery({
    queryKey: ["episode", episodeId, "topologyBlock", "first"],
    queryFn: async () =>
      await axiosCustomized
        .get<TopologyBlockTypes>(
          `/topologyBlocks/episodes/${episodeId}/firstBlock`
        )
        .then((r) => r.data),
    enabled: !!episodeId,
  });
}
