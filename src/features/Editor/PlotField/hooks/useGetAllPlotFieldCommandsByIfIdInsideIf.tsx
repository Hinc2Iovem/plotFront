import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { PlotFieldCommandIfTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";

export default function useGetAllPlotFieldCommandsByIfIdInsideIf({
  plotfieldCommandIfId,
}: {
  plotfieldCommandIfId: string;
}) {
  return useQuery({
    queryKey: ["plotfield", "commandIf", plotfieldCommandIfId, "insideIf"],
    queryFn: async () =>
      await axiosCustomized
        .get<PlotFieldCommandIfTypes[]>(`/plotField/commandIfs/${plotfieldCommandIfId}/insideIf`)
        .then((r) => r.data),
    select: (data) => data.sort((a, b) => a.commandOrder - b.commandOrder),
    enabled: !!plotfieldCommandIfId,
    refetchOnWindowFocus: false,
  });
}
