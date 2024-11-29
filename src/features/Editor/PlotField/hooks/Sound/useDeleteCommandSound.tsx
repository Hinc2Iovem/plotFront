import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteSoundTypes = {
  soundId: string;
};

export default function useDeleteCommandSound({ soundId }: DeleteSoundTypes) {
  return useMutation({
    mutationFn: async () => await axiosCustomized.delete(`/plotFieldCommands/sounds/${soundId}`),
  });
}
