import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateTopologyBlockCoordinatesTypes = {
  topologyBlockId: string;
  sourceBlockId?: string;
};
type UpdateTopologyBlockCoordinatesOnMutationTypes = {
  coordinatesX: number;
  coordinatesY: number;
};

export default function useUpdateTopologyBlockCoordinates({
  topologyBlockId,
}: UpdateTopologyBlockCoordinatesTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      coordinatesX,
      coordinatesY,
    }: UpdateTopologyBlockCoordinatesOnMutationTypes) => {
      await axiosCustomized.patch(
        `/topologyBlocks/${topologyBlockId}/coordinates`,
        {
          coordinatesX,
          coordinatesY,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topologyBlock", topologyBlockId],
        exact: true,
        type: "active",
      });
    },
  });
}
