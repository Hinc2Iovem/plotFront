import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateMusicTextTypes = {
  musicId: string;
  storyId: string;
};

type UpdateMusicTextMutationTypes = {
  musicName: string;
};

export default function useUpdateMusicText({ musicId, storyId }: UpdateMusicTextTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ musicName }: UpdateMusicTextMutationTypes) =>
      await axiosCustomized.patch(`/stories/music/${musicId}`, {
        musicName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "music"],
        exact: true,
        type: "active",
      });
    },
  });
}
