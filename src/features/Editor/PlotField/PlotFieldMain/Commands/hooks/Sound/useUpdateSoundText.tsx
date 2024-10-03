import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateSoundTextTypes = {
  commandSoundId: string;
  storyId: string;
};

type UpdateSoundTextMutationTypes = {
  soundName: string;
};

export default function useUpdateSoundText({
  commandSoundId,
  storyId,
}: UpdateSoundTextTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ soundName }: UpdateSoundTextMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/stories/${storyId}/commandSounds/${commandSoundId}`,
        {
          soundName,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["story", storyId, "sound", "isGlobal"],
        exact: true,
        type: "active",
      });
    },
  });
}
