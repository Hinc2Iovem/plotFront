import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateConditionBlockOrderOfExecutionTypes = {
  conditionBlockId: string;
  commandConditionId: string;
};

type UpdateConditionBlockOnMutationTypes = {
  orderOfExecution: number;
};

export default function useUpdateConditionBlockOrderOfExecution({
  conditionBlockId,
  commandConditionId,
}: UpdateConditionBlockOrderOfExecutionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderOfExecution,
    }: UpdateConditionBlockOnMutationTypes) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/${conditionBlockId}/orderOfExecution`,
        {
          orderOfExecution,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commandCondition", commandConditionId, "conditionBlock"],
        exact: true,
        type: "active",
      });
    },
  });
}
