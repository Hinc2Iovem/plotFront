import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type DeleteConditionBlockVariationProps = {
  conditionBlockVariationId: string;
};

type DeleteConditionBlockVariationBody = {
  type: ConditionValueVariationType;
};

export default function useDeleteConditionBlockVariation({
  conditionBlockVariationId,
}: DeleteConditionBlockVariationProps) {
  return useMutation({
    mutationFn: async ({ type }: DeleteConditionBlockVariationBody) =>
      await axiosCustomized.delete(
        `/commandConditions/conditionBlocks/variations/${conditionBlockVariationId}?type=${type}`
      ),
  });
}
