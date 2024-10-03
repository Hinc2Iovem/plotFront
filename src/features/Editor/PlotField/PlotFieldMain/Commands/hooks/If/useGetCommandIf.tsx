import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { IfCommandTypes } from "../../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";

type GetCommandIfTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandIf({
  plotFieldCommandId,
}: GetCommandIfTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "if"],
    queryFn: async () =>
      await axiosCustomized
        .get<IfCommandTypes>(`/plotFieldCommands/${plotFieldCommandId}/ifs`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
    refetchOnWindowFocus: false,
  });
}
