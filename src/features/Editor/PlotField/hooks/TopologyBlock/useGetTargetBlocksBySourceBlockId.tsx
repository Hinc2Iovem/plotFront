import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TopologyBlockTypes } from "../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetTopologyBlocksTypes = {
  sourceBlockId: string;
};

export default function useGetTargetBlocksBySourceBlockId({
  sourceBlockId,
}: GetTopologyBlocksTypes) {
  return useQuery({
    queryKey: ["connection", "sourceBlock", sourceBlockId],
    queryFn: async () =>
      await axiosCustomized
        .get<TopologyBlockTypes[]>(
          `/topologyBlocks/sourceBlocks/${sourceBlockId}/connection`
        )
        .then((r) => r.data),
    enabled: !!sourceBlockId,
  });
}
