import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type UpdateCommandNameTypes = {
  plotFieldCommandId: string;
  value?: string;
};

type UpdateCommandNameOnMutationTypes = {
  valueOnMutation?: string;
  valueForSay: boolean;
};

export default function useUpdateCommandName({
  plotFieldCommandId,
  value,
}: UpdateCommandNameTypes) {
  return useMutation({
    mutationFn: async ({
      valueForSay,
      valueOnMutation,
    }: UpdateCommandNameOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotField/${plotFieldCommandId}/topologyBlocks/commandName`,
        {
          commandName: valueForSay
            ? "say"
            : value?.toLowerCase() || valueOnMutation?.toLowerCase(),
        }
      ),
  });
}
