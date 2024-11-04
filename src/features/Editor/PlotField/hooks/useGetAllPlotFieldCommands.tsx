import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { PlotFieldTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";

export const getAllPlotfieldCommands = async ({
  topologyBlockId,
}: {
  topologyBlockId: string;
}) => {
  return await axiosCustomized
    .get<PlotFieldTypes[]>(`/plotField/topologyBlocks/${topologyBlockId}`)
    .then((r) => r.data);
};

export default function useGetAllPlotFieldCommands({
  topologyBlockId,
}: {
  topologyBlockId: string;
}) {
  return useQuery({
    queryKey: ["plotfield", "topologyBlock", topologyBlockId],
    queryFn: async () => getAllPlotfieldCommands({ topologyBlockId }),
    select: (data) => data.sort((a, b) => a.commandOrder - b.commandOrder),
    enabled: !!topologyBlockId,
  });
}
