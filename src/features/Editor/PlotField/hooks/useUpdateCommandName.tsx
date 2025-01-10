import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";

type UpdateCommandNameTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

type UpdateCommandNameOnMutationTypes = {
  valueOnMutation?: string;
  valueForSay: boolean;
  value?: string;
};

export default function useUpdateCommandName({ plotFieldCommandId, topologyBlockId }: UpdateCommandNameTypes) {
  return useMutation({
    mutationFn: async ({ valueForSay, value, valueOnMutation }: UpdateCommandNameOnMutationTypes) =>
      await axiosCustomized.patch(`/plotField/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/commandName`, {
        commandName: valueForSay ? "say" : value?.toLowerCase() || valueOnMutation?.toLowerCase(),
      }),
  });
}
