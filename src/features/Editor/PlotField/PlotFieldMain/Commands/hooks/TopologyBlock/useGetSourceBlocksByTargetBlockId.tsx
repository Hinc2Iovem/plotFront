import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { TopologyBlockTypes } from "../../../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetTopologyBlocksTypes = {
  targetBlockId: string;
};

export default function useGetSourceBlocksByTargetBlockId({
  targetBlockId,
}: GetTopologyBlocksTypes) {
  return useQuery({
    queryKey: ["connection", "targetBlock", targetBlockId],
    queryFn: async () =>
      await axiosCustomized
        .get<TopologyBlockTypes[]>(
          `/topologyBlocks/targetBlocks/${targetBlockId}/connection`
        )
        .then((r) => r.data),
    enabled: !!targetBlockId,
  });
}
