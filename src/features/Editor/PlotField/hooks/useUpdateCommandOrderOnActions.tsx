import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";

export type AllPossibleCommandOrderActions = "paste" | "delete";

type UpdateCommandOrderTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

type UpdateCommandOrderTypesOnMutation = {
  commandOrder: number;
  type: AllPossibleCommandOrderActions;
};

export default function useUpdateCommandOrderOnActions({
  plotFieldCommandId,
  topologyBlockId,
}: UpdateCommandOrderTypes) {
  return useMutation({
    mutationFn: async ({
      commandOrder,
      type,
    }: UpdateCommandOrderTypesOnMutation) =>
      await axiosCustomized.patch(
        `/plotField/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/commandOrder/actions`,
        {
          type,
          commandOrder,
        }
      ),
  });
}
