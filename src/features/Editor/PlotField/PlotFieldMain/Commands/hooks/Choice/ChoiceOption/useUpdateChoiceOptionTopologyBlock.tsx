import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateChoiceOptionTopologyBlockTypes = {
  choiceOptionId: string;
  episodeId: string;
};

type UpdateChoiceOptionTopologyBlockOnMutationTypes = {
  targetBlockId: string;
  sourceBlockId: string;
};

export default function useUpdateChoiceOptionTopologyBlock({
  choiceOptionId,
  episodeId,
}: UpdateChoiceOptionTopologyBlockTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      targetBlockId,
      sourceBlockId,
    }: UpdateChoiceOptionTopologyBlockOnMutationTypes) => {
      await axiosCustomized.patch(
        `/plotFieldCommands/choices/options/${choiceOptionId}/sourceBlocks/${sourceBlockId}/targetBlocks/${targetBlockId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["connection", "episode", episodeId],
        exact: true,
        type: "active",
      });
    },
  });
}
