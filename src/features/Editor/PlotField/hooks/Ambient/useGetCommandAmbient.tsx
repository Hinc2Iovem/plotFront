import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { AmbientTypes } from "../../../../../types/StoryEditor/PlotField/Ambient/AmbientTypes";

type GetCommandAmbientTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandAmbient({
  plotFieldCommandId,
}: GetCommandAmbientTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "ambient"],
    queryFn: async () =>
      await axiosCustomized
        .get<AmbientTypes>(`/plotFieldCommands/${plotFieldCommandId}/ambients`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
