import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";

type UpdateEpisodeOrderTypes = {
  episodeId: string;
  newOrder: number;
};

export default function useUpdateEpisodeOrder() {
  return useMutation({
    mutationFn: async ({ episodeId, newOrder }: UpdateEpisodeOrderTypes) =>
      await axiosCustomized.patch(`/episodes/${episodeId}/newOrder`, {
        newOrder,
      }),
  });
}
