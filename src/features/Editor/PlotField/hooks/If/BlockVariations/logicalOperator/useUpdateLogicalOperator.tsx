import { useMutation } from "@tanstack/react-query";
import { LogicalOperatorTypes } from "../../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateLogicalOperatorProps = {
  ifId: string;
};

type UpdateLogicalOperatorBody = {
  logicalOperator: LogicalOperatorTypes;
  index: number;
};

export default function useUpdateLogicalOperator({ ifId }: UpdateLogicalOperatorProps) {
  return useMutation({
    mutationFn: async ({ logicalOperator, index }: UpdateLogicalOperatorBody) =>
      await axiosCustomized.patch(`/ifs/${ifId}/logicalOperator`, {
        logicalOperator,
        index,
      }),
  });
}
