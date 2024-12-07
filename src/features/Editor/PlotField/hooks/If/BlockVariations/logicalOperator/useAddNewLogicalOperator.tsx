import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { LogicalOperatorTypes } from "../../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type AddNewLogicalOperatorProps = {
  ifId: string;
};

type AddNewLogicalOperatorBody = {
  logicalOperator: LogicalOperatorTypes;
};

export default function useAddNewLogicalOperator({ ifId }: AddNewLogicalOperatorProps) {
  return useMutation({
    mutationFn: async ({ logicalOperator }: AddNewLogicalOperatorBody) =>
      await axiosCustomized.post(`/ifs/${ifId}/logicalOperator`, {
        logicalOperator,
      }),
  });
}
