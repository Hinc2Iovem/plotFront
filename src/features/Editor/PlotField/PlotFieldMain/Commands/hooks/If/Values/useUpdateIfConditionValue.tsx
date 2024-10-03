import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { IfValueTypes } from "../../../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type UpdateIfConditionValueTypes = {
  ifValueId: string;
};
type UpdateIfConditionValueOnMutationTypes = {
  sign?: ConditionSignTypes;
  name?: string;
  value?: number;
};

export default function useUpdateIfConditionValue({
  ifValueId,
}: UpdateIfConditionValueTypes) {
  return useMutation({
    mutationFn: async ({
      name,
      sign,
      value,
    }: UpdateIfConditionValueOnMutationTypes) =>
      await axiosCustomized.patch<IfValueTypes>(
        `/plotFieldCommands/ifs/ifValues/${ifValueId}`,
        {
          name,
          sign,
          value,
        }
      ),
  });
}
