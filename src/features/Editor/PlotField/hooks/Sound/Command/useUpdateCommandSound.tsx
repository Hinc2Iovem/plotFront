import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

export default function useUpdateCommandSound() {
  return useMutation({
    mutationFn: async ({ commandSoundId, soundId }: { commandSoundId?: string; soundId: string }) => {
      await axiosCustomized.patch(`/plotFieldCommands/${commandSoundId}/sounds/${soundId}`);
    },
  });
}
