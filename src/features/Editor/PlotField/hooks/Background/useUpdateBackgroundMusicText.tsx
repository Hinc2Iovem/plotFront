import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateMusicTextTypes = {
  backgroundId: string;
  storyId: string;
};

type UpdateMusicTextMutationTypes = {
  musicName: string;
};

export default function useUpdateBackgroundMusicText({
  backgroundId,
  storyId,
}: UpdateMusicTextTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ musicName }: UpdateMusicTextMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/stories/${storyId}/backgrounds/${backgroundId}/musicName`,
        {
          musicName,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "music"],
        exact: true,
        type: "active",
      });
    },
  });
}
