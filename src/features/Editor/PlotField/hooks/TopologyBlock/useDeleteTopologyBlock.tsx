import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteTopologyBlocksTypes = {
  topologyBlockId: string;
};

export default function useDeleteTopologyBlockById({ topologyBlockId }: DeleteTopologyBlocksTypes) {
  return useMutation({
    mutationFn: () => axiosCustomized.delete<string>(`/topologyBlocks/${topologyBlockId}`),
  });
}
