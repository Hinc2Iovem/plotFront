import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateChoiceTypes = {
  plotFieldCommandId?: string;
  topologyBlockId: string;
};

export default function useCreateChoice({ plotFieldCommandId, topologyBlockId }: CreateChoiceTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/choices/${commandId}/topologyBlocks/${topologyBlockId}/translations`);
    },
  });
}
