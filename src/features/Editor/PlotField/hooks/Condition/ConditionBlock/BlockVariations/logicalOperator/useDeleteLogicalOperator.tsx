import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type DeleteLogicalOperatorProps = {
  conditionBlockId: string;
};

type DeleteLogicalOperatorBody = {
  index: number;
};

export default function useDeleteLogicalOperator({ conditionBlockId }: DeleteLogicalOperatorProps) {
  return useMutation({
    mutationFn: async ({ index }: DeleteLogicalOperatorBody) =>
      await axiosCustomized.delete(
        `/commandConditions/conditionBlocks/${conditionBlockId}/logicalOperator?index=${index}`
      ),
  });
}
