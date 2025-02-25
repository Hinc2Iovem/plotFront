import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateTopologyBlockNameTypes = {
  topologyBlockId: string;
};
type UpdateTopologyBlockNameOnMutationTypes = {
  name: string;
};

export default function useUpdateTopologyBlockName({ topologyBlockId }: UpdateTopologyBlockNameTypes) {
  return useMutation({
    mutationFn: async ({ name }: UpdateTopologyBlockNameOnMutationTypes) =>
      await axiosCustomized.patch(`/topologyBlocks/${topologyBlockId}/name`, {
        newName: name,
      }),
  });
}
