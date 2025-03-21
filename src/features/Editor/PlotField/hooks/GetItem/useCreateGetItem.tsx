import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateGetItemTypes = {
  plotFieldCommandId?: string;
  topologyBlockId: string;
};

export default function useCreateGetItem({
  plotFieldCommandId,
  topologyBlockId,
}: CreateGetItemTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(
        `/getItems/${commandId}/topologyBlocks/${topologyBlockId}/translations`
      );
    },
  });
}
