import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteSoundTypes = {
  soundId: string;
  storyId: string;
};

export default function useDeleteSound({ soundId, storyId }: DeleteSoundTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await axiosCustomized.delete(`/stories/sounds/${soundId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["story", storyId, "sound", "isGlobal"],
        exact: true,
        type: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["story", storyId, "sound"],
        exact: true,
        type: "active",
      });
    },
  });
}
