import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type UpdateConditionBlockOrderOfExecutionTypes = {
  conditionBlockId: string;
  commandConditionId: string;
};

type UpdateConditionBlockOnMutationTypes = {
  orderOfExecution: number;
};

export default function useUpdateConditionBlockOrderOfExecution({
  conditionBlockId,
}: UpdateConditionBlockOrderOfExecutionTypes) {
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
  });
}
