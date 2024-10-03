import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { PlotFieldCommandIfTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";

export default function useGetAllPlotFieldCommandsByIfIdInsideIf({
  commandIfId,
}: {
  commandIfId: string;
}) {
  return useQuery({
    queryKey: ["plotfield", "commandIf", commandIfId, "insideIf"],
    queryFn: async () =>
      await axiosCustomized
        .get<PlotFieldCommandIfTypes[]>(
          `/plotField/commandIfs/${commandIfId}/insideIf`
        )
        .then((r) => r.data),
    select: (data) => data.sort((a, b) => a.commandOrder - b.commandOrder),
    enabled: !!commandIfId,
    refetchOnWindowFocus: false,
  });
}
