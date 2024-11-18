import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type DeleteConditionBlockVariationProps = {
  conditionBlockVariationIdParams?: string;
};

type DeleteConditionBlockVariationBody = {
  type: ConditionValueVariationType;
  conditionBlockVariationIdBody?: string;
  index?: number;
  conditionBlockId?: string;
};

export default function useDeleteConditionBlockVariation({
  conditionBlockVariationIdParams,
}: DeleteConditionBlockVariationProps) {
  return useMutation({
    mutationFn: async ({
      type,
      conditionBlockVariationIdBody,
      conditionBlockId,
      index,
    }: DeleteConditionBlockVariationBody) => {
      const conditionBlockVariationId = conditionBlockVariationIdParams?.trim().length
        ? conditionBlockVariationIdParams
        : conditionBlockVariationIdBody;
      await axiosCustomized.delete(
        `/commandConditions/conditionBlocks/variations/${conditionBlockVariationId}?type=${type}&index=${index}&conditionBlockId=${conditionBlockId}`
      );
    },
  });
}
