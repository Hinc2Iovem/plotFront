import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateConditionBlockTopologyBlockIdTypes = {
  conditionBlockId: string;
  sourceBlockId: string;
  episodeId: string;
};

export default function useUpdateConditionBlockTopologyBlockId({
  conditionBlockId,
  sourceBlockId,
  episodeId,
}: UpdateConditionBlockTopologyBlockIdTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetBlockId }: { targetBlockId: string }) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/${conditionBlockId}/sourceBlocks/${sourceBlockId}/targetBlocks/${targetBlockId}`
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
