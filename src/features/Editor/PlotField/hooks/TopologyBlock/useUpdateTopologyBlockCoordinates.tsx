import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateTopologyBlockCoordinatesTypes = {
  topologyBlockId?: string;
};
type UpdateTopologyBlockCoordinatesOnMutationTypes = {
  topologyBlockBodyId?: string;
  coordinatesX: number;
  coordinatesY: number;
};

export default function useUpdateTopologyBlockCoordinates({ topologyBlockId }: UpdateTopologyBlockCoordinatesTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      coordinatesX,
      coordinatesY,
      topologyBlockBodyId,
    }: UpdateTopologyBlockCoordinatesOnMutationTypes) => {
      const currentTopologyBlockId = topologyBlockBodyId?.trim().length ? topologyBlockBodyId : topologyBlockId;
      await axiosCustomized.patch(`/topologyBlocks/${currentTopologyBlockId}/coordinates`, {
        coordinatesX,
        coordinatesY,
      });
    },
    onSuccess: (_, variables) => {
      const { topologyBlockBodyId } = variables;

      const currentTopologyBlockId = topologyBlockBodyId?.trim().length ? topologyBlockBodyId : topologyBlockId;
      queryClient.invalidateQueries({
        queryKey: ["topologyBlock", currentTopologyBlockId],
        exact: true,
        type: "active",
      });
    },
  });
}
