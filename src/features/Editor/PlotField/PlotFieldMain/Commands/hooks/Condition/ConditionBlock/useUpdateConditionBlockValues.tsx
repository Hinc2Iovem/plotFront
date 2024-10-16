import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type UpdateConditionBlockValuesTypes = {
  conditionBlockId: string;
  episodeId: string;
};

type UpdateConditionValueOnMutation = {
  name: string | undefined;
  sign: ConditionSignTypes | undefined;
  value: string | undefined;
  type: string | undefined;
};

export default function useUpdateConditionBlockValues({
  conditionBlockId,
  episodeId,
}: UpdateConditionBlockValuesTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      sign,
      type,
      value,
    }: UpdateConditionValueOnMutation) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/${conditionBlockId}/conditionBlockValues`,
        {
          sign,
          type,
          value,
          name,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connection", "episode", episodeId],
        exact: true,
        type: "active",
      });
    },
  });
}
