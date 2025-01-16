import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

export default function useUpdateCommandMusic() {
  return useMutation({
    mutationFn: async ({ commandMusicId, musicId }: { commandMusicId?: string; musicId: string }) => {
      await axiosCustomized.patch(`/plotFieldCommands/${commandMusicId}/musics/${musicId}`);
    },
  });
}
