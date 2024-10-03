import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

export default function useCreateTopologyBlockConnection({
  sourceBlockId,
  episodeId,
}: {
  sourceBlockId: string;
  episodeId: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ targetBlockId }: { targetBlockId: string }) =>
      await axiosCustomized.post(
        `/topologyBlocks/episodes/${episodeId}/sourceBlocks/${sourceBlockId}/targetBlocks/${targetBlockId}/connection`
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
