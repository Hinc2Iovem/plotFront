import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type UpdateConditionValueTypes = {
  conditionValueId: string;
};

type UpdateConditionValueOnMutationTypes = {
  name?: string;
  value?: number;
  sign?: ConditionSignTypes;
};

export default function useUpdateConditionValue({
  conditionValueId,
}: UpdateConditionValueTypes) {
  return useMutation({
    mutationFn: async ({
      name,
      sign,
      value,
    }: UpdateConditionValueOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/conditionBlocks/conditionValues/${conditionValueId}`,
        {
          name,
          value,
          sign,
        }
      ),
  });
}
