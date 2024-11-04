import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { MusicCommandTypes } from "../../../../../types/StoryEditor/PlotField/Music/MusicCommandTypes";

type GetCommandMusicTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandMusic({
  plotFieldCommandId,
}: GetCommandMusicTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "music"],
    queryFn: async () =>
      await axiosCustomized
        .get<MusicCommandTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/music`
        )
        .then((r) => r.data),
  });
}
