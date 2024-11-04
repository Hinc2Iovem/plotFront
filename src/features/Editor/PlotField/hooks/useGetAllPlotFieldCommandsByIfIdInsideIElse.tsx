import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { PlotFieldCommandIfTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";

export default function useGetAllPlotFieldCommandsByIfIdInsideElse({
  commandIfId,
}: {
  commandIfId: string;
}) {
  return useQuery({
    queryKey: ["plotfield", "commandIf", commandIfId, "insideElse"],
    queryFn: async () =>
      await axiosCustomized
        .get<PlotFieldCommandIfTypes[]>(
          `/plotField/commandIfs/${commandIfId}/insideElse`
        )
        .then((r) => r.data),
    select: (data) => data.sort((a, b) => a.commandOrder - b.commandOrder),
    enabled: !!commandIfId,
    refetchOnWindowFocus: false,
  });
}
