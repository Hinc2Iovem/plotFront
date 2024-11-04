import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { PlotFieldTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { TRANSLATABLE_COMMANDS } from "../../../../const/TRANSLATABLE_COMMANDS";

export default function useGetAllTranslatablePlotFieldCommands({
  topologyBlockId,
}: {
  topologyBlockId: string;
}) {
  return useQuery({
    queryKey: ["plotfield", "translatable", "topologyBlock", topologyBlockId],
    queryFn: async () =>
      await axiosCustomized
        .get<PlotFieldTypes[]>(`/plotField/topologyBlocks/${topologyBlockId}`)
        .then((r) => r.data),
    select: (data) =>
      data.filter((d) => TRANSLATABLE_COMMANDS.includes(d.command)),
    enabled: !!topologyBlockId,
  });
}
