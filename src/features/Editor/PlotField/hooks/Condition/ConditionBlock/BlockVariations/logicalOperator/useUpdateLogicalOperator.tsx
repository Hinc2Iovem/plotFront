import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { LogicalOperatorTypes } from "../../../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type UpdateLogicalOperatorProps = {
  conditionBlockId: string;
};

type UpdateLogicalOperatorBody = {
  logicalOperator: LogicalOperatorTypes;
  index: number;
};

export default function useUpdateLogicalOperator({ conditionBlockId }: UpdateLogicalOperatorProps) {
  return useMutation({
    mutationFn: async ({ logicalOperator, index }: UpdateLogicalOperatorBody) =>
      await axiosCustomized.patch(`/commandConditions/conditionBlocks/${conditionBlockId}/logicalOperator`, {
        logicalOperator,
        index,
      }),
  });
}
