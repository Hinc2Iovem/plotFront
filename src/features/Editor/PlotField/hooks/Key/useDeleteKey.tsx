import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type DeleteKeyTypes = {
  keyId: string;
};

export default function useDeleteKey({ storyId, page, limit }: { storyId: string; page: number; limit: number }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ keyId }: DeleteKeyTypes) => await axiosCustomized.delete<KeyTypes>(`/keys/${keyId}`),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "key"],
      });
      queryClient.removeQueries({
        queryKey: ["all-mighty-search", "story", storyId, "key", "paginated", "page", page, "limit", limit],
      });
    },
  });
}
