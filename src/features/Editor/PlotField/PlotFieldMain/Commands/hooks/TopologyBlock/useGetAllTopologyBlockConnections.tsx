import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { TopologyBlockConnectionTypes } from "../../../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetAllTopologyBlockConnectionsTypes = {
  topologyBlockId: string;
};

export default function useGetAllTopologyBlockConnections({
  topologyBlockId,
}: GetAllTopologyBlockConnectionsTypes) {
  return useQuery({
    queryKey: ["connections", "topologyBlock", topologyBlockId],
    queryFn: async () =>
      await axiosCustomized
        .get<TopologyBlockConnectionTypes[]>(
          `/topologyBlocks/${topologyBlockId}/connection`
        )
        .then((r) => r.data),
    enabled: !!topologyBlockId,
  });
}
