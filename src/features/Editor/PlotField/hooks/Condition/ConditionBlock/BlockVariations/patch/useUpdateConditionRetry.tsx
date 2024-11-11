import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type UpdateConditionRetryProps = {
  conditionBlockRetryId: string;
};

type UpdateConditionRetryBody = {
  amountOfRetries?: number;
  sign?: ConditionSignTypes;
};

export default function useUpdateConditionRetry({ conditionBlockRetryId }: UpdateConditionRetryProps) {
  return useMutation({
    mutationFn: async ({ sign, amountOfRetries }: UpdateConditionRetryBody) =>
      await axiosCustomized.patch(`/commandConditions/conditionBlocks/conditionRetry/${conditionBlockRetryId}`, {
        amountOfRetries,
        sign,
      }),
  });
}
