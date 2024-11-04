import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type AddAnotherConditionBlockTypes = {
  commandConditionId: string;
  episodeId: string;
};

type AddAnotherConditionBlockTypesOnMutation = {
  type: string;
  coordinatesX: number;
  coordinatesY: number;
  orderOfExecution: number;
  sourceBlockName: string;
  targetBlockId: string;
  topologyBlockId: string;
  conditionBlockId: string;
};

export default function useAddAnotherConditionBlock({
  commandConditionId,
  episodeId,
}: AddAnotherConditionBlockTypes) {
  // const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      coordinatesX,
      coordinatesY,
      sourceBlockName,
      targetBlockId,
      topologyBlockId,
      type,
      conditionBlockId,
      orderOfExecution,
    }: AddAnotherConditionBlockTypesOnMutation) =>
      await axiosCustomized.post(
        `/commandConditions/${commandConditionId}/episodes/${episodeId}/conditionBlocks`,
        {
          coordinatesX,
          coordinatesY,
          sourceBlockName,
          targetBlockId,
          topologyBlockId,
          type,
          conditionBlockId,
          orderOfExecution,
        }
      ),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["commandCondition", commandConditionId, "conditionBlock"],
    //     exact: true,
    //     type: "active",
    //   });
    // },
  });
}
