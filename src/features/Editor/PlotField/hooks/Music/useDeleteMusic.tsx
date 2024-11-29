import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteMusicTypes = {
  musicId?: string;
  storyId: string;
};

export default function useDeleteMusic({ musicId, storyId }: DeleteMusicTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosCustomized.delete(`/stories/music/${musicId}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "music"],
      });
    },
  });
}
