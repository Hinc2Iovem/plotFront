import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { PlotFieldCommandIfTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";

export default function useGetAllPlotFieldCommandsByIfIdInsideElse({
  plotfieldCommandIfId,
}: {
  plotfieldCommandIfId: string;
}) {
  return useQuery({
    queryKey: ["plotfield", "commandIf", plotfieldCommandIfId, "insideElse"],
    queryFn: async () =>
      await axiosCustomized
        .get<PlotFieldCommandIfTypes[]>(`/plotField/commandIfs/${plotfieldCommandIfId}/insideElse`)
        .then((r) => r.data),
    select: (data) => data.sort((a, b) => a.commandOrder - b.commandOrder),
    enabled: !!commandIfId,
    refetchOnWindowFocus: false,
  });
}
