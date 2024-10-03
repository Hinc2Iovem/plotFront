import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateCallTextTypes = {
  callId: string;
  targetBlockId: string;
  sourceBlockId: string;
  episodeId: string;
};

export default function useUpdateCallText({
  callId,
  sourceBlockId,
  targetBlockId,
  episodeId,
}: UpdateCallTextTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosCustomized.patch(
        `/plotFieldCommands/calls/${callId}/targetBlocks/${targetBlockId}/sourceBlocks/${sourceBlockId}`
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
