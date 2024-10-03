import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { TopologyBlockTypes } from "../../../../../../../types/TopologyBlock/TopologyBlockTypes";

type GetTopologyBlocksTypes = {
  topologyBlockId: string;
};

export const getTopologyBlockById = async ({
  topologyBlockId,
}: GetTopologyBlocksTypes) => {
  return await axiosCustomized
    .get<TopologyBlockTypes>(`/topologyBlocks/${topologyBlockId}`)
    .then((r) => r.data);
};

export default function useGetTopologyBlockById({
  topologyBlockId,
}: GetTopologyBlocksTypes) {
  return useQuery({
    queryKey: ["topologyBlock", topologyBlockId],
    queryFn: async () => getTopologyBlockById({ topologyBlockId }),
    enabled: !!topologyBlockId,
  });
}
