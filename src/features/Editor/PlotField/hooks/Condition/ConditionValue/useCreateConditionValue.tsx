import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type CreateConditionValueTypes = {
  conditionBlockId: string;
};

export default function useCreateConditionValue({
  conditionBlockId,
}: CreateConditionValueTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/conditionBlocks/${conditionBlockId}/conditionValues`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conditionBlock", conditionBlockId, "conditionValue"],
        exact: true,
        type: "active",
      });
    },
  });
}
