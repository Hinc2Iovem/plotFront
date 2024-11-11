import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type AddNewConditionBlockVariationProps = {
  conditionBlockId: string;
};

type AddNewConditionBlockVariationBody = {
  _id: string;
  type: ConditionValueVariationType;
};

export default function useAddNewConditionBlockVariation({ conditionBlockId }: AddNewConditionBlockVariationProps) {
  return useMutation({
    mutationFn: async ({ _id, type }: AddNewConditionBlockVariationBody) =>
      await axiosCustomized.post(`/commandConditions/conditionBlocks/${conditionBlockId}/variations`, {
        _id,
        type,
      }),
  });
}
