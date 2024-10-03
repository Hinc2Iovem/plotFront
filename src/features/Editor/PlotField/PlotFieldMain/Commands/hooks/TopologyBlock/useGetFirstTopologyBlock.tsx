import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { TopologyBlockTypes } from "../../../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetFirstTopologyBlockTypes = {
  episodeId: string;
};

export default function useGetFirstTopologyBlock({
  episodeId,
}: GetFirstTopologyBlockTypes) {
  return useQuery({
    queryKey: ["editor", "episode", episodeId, "firstTopologyBlock"],
    queryFn: async () =>
      await axiosCustomized
        .get<TopologyBlockTypes>(
          `/topologyBlocks/episodes/${episodeId}/firstBlock`
        )
        .then((r) => r.data),
    enabled: !!episodeId,
  });
}
