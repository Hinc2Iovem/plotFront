import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { ConditionSignTypes } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type UpdateIfRetryProps = {
  ifRetryId: string;
};

type UpdateIfRetryBody = {
  amountOfRetries?: number;
  sign?: ConditionSignTypes;
};

export default function useUpdateIfRetry({ ifRetryId }: UpdateIfRetryProps) {
  return useMutation({
    mutationFn: async ({ sign, amountOfRetries }: UpdateIfRetryBody) =>
      await axiosCustomized.patch(`/ifs/ifRetry/${ifRetryId}`, {
        amountOfRetries,
        sign,
      }),
  });
}
