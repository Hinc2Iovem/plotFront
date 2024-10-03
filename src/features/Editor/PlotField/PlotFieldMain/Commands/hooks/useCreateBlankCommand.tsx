import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import {
  AllPossiblePlotFieldComamndsTypes,
  PlotFieldTypes,
} from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";

type NewCommandTypes = {
  _id: string;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandOrder: number;
};

export default function useCreateBlankCommand({
  topologyBlockId,
}: {
  topologyBlockId: string;
}) {
  const { addCommand } = usePlotfieldCommands();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["new", "plotfield", "topologyBlock", topologyBlockId],
    mutationFn: async (commandOrder) => {
      return await axiosCustomized
        .post<PlotFieldTypes>(`/plotField/topologyBlocks/${topologyBlockId}`, {
          commandOrder: commandOrder.commandOrder,
          _id: commandOrder._id,
        })
        .then((r) => r.data);
    },
    onMutate: async (newCommand: NewCommandTypes) => {
      await queryClient.cancelQueries({
        queryKey: ["plotfield", "topologyBlock", topologyBlockId],
      });

      const prevCommands = queryClient.getQueryData([
        "plotfield",
        "topologyBlock",
        topologyBlockId,
      ]);

      addCommand({
        newCommand: {
          _id: newCommand._id,
          command: "" as AllPossiblePlotFieldComamndsTypes,
          commandOrder: newCommand.commandOrder,
          topologyBlockId,
        },
        topologyBlockId,
      });

      return { prevCommands };
    },
    onError: (_err, _newCommand, context) => {
      queryClient.setQueryData(
        ["plotfield", "topologyBlock", topologyBlockId],
        context?.prevCommands
      );
    },
  });
}
