import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateSoundTypes = {
  storyId: string;
};

type CreateSoundBodyTypes = {
  soundId: string;
  soundName: string;
};

export default function useCreateSound({ storyId }: CreateSoundTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ soundId, soundName }: CreateSoundBodyTypes) => {
      await axiosCustomized.post(`/stories/${storyId}/sounds/${soundId}`, {
        soundName,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["story", storyId, "sound"],
        exact: true,
      });
    },
  });
}
