import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { TopologyBlockConnectionTypes } from "../../../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetTopologyBlocksTypes = {
  episodeId: string;
};

export const getAllTopologyBlocksConnectionsByEpisodeId = async ({
  episodeId,
}: GetTopologyBlocksTypes) => {
  return await axiosCustomized
    .get<TopologyBlockConnectionTypes[]>(
      `/topologyBlocks/episodes/${episodeId}/connection`
    )
    .then((r) => r.data);
};

export default function useGetAllTopologyBlockConnectionsByEpisodeId({
  episodeId,
}: GetTopologyBlocksTypes) {
  return useQuery({
    queryKey: ["connection", "episode", episodeId],
    queryFn: async () =>
      getAllTopologyBlocksConnectionsByEpisodeId({ episodeId }),
    enabled: !!episodeId,
  });
}
