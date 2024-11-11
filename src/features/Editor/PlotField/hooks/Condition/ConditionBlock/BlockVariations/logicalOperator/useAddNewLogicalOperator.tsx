import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { LogicalOperatorTypes } from "../../../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type AddNewLogicalOperatorProps = {
  conditionBlockId: string;
};

type AddNewLogicalOperatorBody = {
  logicalOperator: LogicalOperatorTypes;
};

export default function useAddNewLogicalOperator({ conditionBlockId }: AddNewLogicalOperatorProps) {
  return useMutation({
    mutationFn: async ({ logicalOperator }: AddNewLogicalOperatorBody) =>
      await axiosCustomized.post(`/commandConditions/conditionBlocks/${conditionBlockId}/logicalOperator`, {
        logicalOperator,
      }),
  });
}
