import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateSoundTextTypes = {
  soundId: string;
  storyId: string;
};

type UpdateSoundTextMutationTypes = {
  soundName: string;
};

export default function useUpdateSoundText({ soundId, storyId }: UpdateSoundTextTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ soundName }: UpdateSoundTextMutationTypes) =>
      await axiosCustomized.patch(`/stories/sounds/${soundId}`, {
        soundName,
      }),
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
