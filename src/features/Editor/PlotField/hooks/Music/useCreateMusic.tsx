import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateMusicTypes = {
  storyId: string;
};

type CreateMusicBodyTypes = {
  musicId: string;
  musicName: string;
};

export default function useCreateMusic({ storyId }: CreateMusicTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ musicId, musicName }: CreateMusicBodyTypes) => {
      await axiosCustomized.post(`/stories/${storyId}/music/${musicId}`, {
        musicName,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "music"],
        exact: true,
      });
    },
  });
}
