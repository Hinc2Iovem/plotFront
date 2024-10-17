import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateWardrobeTypes = {
  plotFieldCommandId?: string;
  topologyBlockId: string;
};

export default function useCreateWardrobe({
  plotFieldCommandId,
  topologyBlockId,
}: CreateWardrobeTypes) {
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
        `/commandWardrobes/${commandId}/topologyBlocks/${topologyBlockId}/translations`
      );
    },
  });
}
