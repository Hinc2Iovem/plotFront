import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { BackgroundTypes } from "../../../../../../../types/StoryEditor/PlotField/Background/BackgroundTypes";
import { getMusicById } from "../Music/useGetMusicById";

type GetCommandBackgroundTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandBackground({
  plotFieldCommandId,
}: GetCommandBackgroundTypes) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "background"],
    queryFn: async () => {
      const bg = await axiosCustomized
        .get<BackgroundTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/backgrounds`
        )
        .then((r) => r.data);
      queryClient.prefetchQuery({
        queryKey: ["stories", "music", bg.musicId],
        queryFn: () => getMusicById({ musicId: bg.musicId || "" }),
      });
      return bg;
    },
  });
}
