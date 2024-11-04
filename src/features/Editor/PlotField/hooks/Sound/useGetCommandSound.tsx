import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { SoundCommandTypes } from "../../../../../types/StoryEditor/PlotField/Sound/SoundCommandTypes";

type GetCommandSoundTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandSound({
  plotFieldCommandId,
}: GetCommandSoundTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "sound"],
    queryFn: async () =>
      await axiosCustomized
        .get<SoundCommandTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/sounds`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
