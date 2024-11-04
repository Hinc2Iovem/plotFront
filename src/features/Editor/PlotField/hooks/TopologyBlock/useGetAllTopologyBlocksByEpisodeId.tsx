import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TopologyBlockTypes } from "../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetTopologyBlocksTypes = {
  episodeId: string;
};

export const getAllTopologyBlocksByEpisodeId = async ({
  episodeId,
}: GetTopologyBlocksTypes) => {
  return await axiosCustomized
    .get<TopologyBlockTypes[]>(`/topologyBlocks/episodes/${episodeId}`)
    .then((r) => r.data);
};

export default function useGetAllTopologyBlocksByEpisodeId({
  episodeId,
}: GetTopologyBlocksTypes) {
  return useQuery({
    queryKey: ["episode", episodeId, "topologyBlock"],
    queryFn: async () => getAllTopologyBlocksByEpisodeId({ episodeId }),
    enabled: !!episodeId,
  });
}
