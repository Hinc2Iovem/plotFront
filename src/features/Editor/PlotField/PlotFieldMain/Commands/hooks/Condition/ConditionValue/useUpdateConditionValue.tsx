import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type UpdateConditionValueTypes = {
  conditionBlockId: string;
};

type UpdateConditionValueOnMutationTypes = {
  name?: string;
  value?: string;
  sign?: ConditionSignTypes;
  type?: ConditionValueVariationType;
  blockValueId?: string;
};

export default function useUpdateConditionValue({
  conditionBlockId,
}: UpdateConditionValueTypes) {
  return useMutation({
    mutationFn: async ({
      name,
      sign,
      value,
      type,
      blockValueId,
    }: UpdateConditionValueOnMutationTypes) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/${conditionBlockId}/conditionBlockValues`,
        {
          name,
          value,
          sign,
          type,
          blockValueId,
        }
      ),
  });
}
