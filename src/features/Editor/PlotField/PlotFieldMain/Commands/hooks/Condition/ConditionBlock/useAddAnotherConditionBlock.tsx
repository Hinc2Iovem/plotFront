import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type AddAnotherConditionBlockTypes = {
  commandConditionId: string;
};

export default function useAddAnotherConditionBlock({
  commandConditionId,
}: AddAnotherConditionBlockTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/commandConditions/${commandConditionId}/conditionBlocks`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commandCondition", commandConditionId, "conditionBlock"],
        exact: true,
        type: "active",
      });
    },
  });
}
