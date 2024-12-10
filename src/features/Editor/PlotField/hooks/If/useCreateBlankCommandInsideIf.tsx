import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import useSearch from "../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

type CreateBlankCommandTypes = {
  topologyBlockId: string;
  commandIfId?: string;
  isElse?: boolean;
};

type NewCommandTypes = {
  _id: string;
  commandIfId?: string;
  isElse: boolean;
  topologyBlockId: string;
  command?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  commandOrder: number;
};

export default function useCreateBlankCommandInsideIf({ topologyBlockId, commandIfId }: CreateBlankCommandTypes) {
  const queryClient = useQueryClient();
  const { episodeId } = useParams();
  const { addItem } = useSearch();

  const { addCommandIf, updateCommandIfInfo, removeCommandIfItem } = usePlotfieldCommands();

  return useMutation({
    mutationFn: async (commandOrder: NewCommandTypes) => {
      const ifId = commandIfId ? commandIfId : commandOrder?.commandIfId;
      const elseOrIf = commandOrder.isElse;
      const currentTopologyBlockId = commandOrder?.topologyBlockId?.trim().length
        ? commandOrder.topologyBlockId
        : topologyBlockId;

      await axiosCustomized.post(`/plotField/topologyBlocks/${currentTopologyBlockId}/commandIfs/${ifId}`, {
        isElse: elseOrIf,
        commandOrder: commandOrder.commandOrder,
        _id: commandOrder._id,
        commandName: commandOrder.command,
      });
    },
    onMutate: async (commandOrder: NewCommandTypes) => {
      let prevCommands;
      const elseOrIf = commandOrder.isElse;
      const currentTopologyBlockId = commandOrder?.topologyBlockId?.trim().length
        ? commandOrder.topologyBlockId
        : topologyBlockId;

      addItem({
        episodeId: episodeId || "",
        item: {
          commandName:
            commandOrder.command === "say" ? commandOrder.sayType || "author" : commandOrder.command || "command",
          type: "command",
          id: commandOrder._id,
          text: "",
          topologyBlockId: currentTopologyBlockId,
        },
      });

      if (elseOrIf) {
        await queryClient.cancelQueries({
          queryKey: ["plotfield", "commandIf", commandOrder.commandIfId, "insideElse"],
        });
        prevCommands = queryClient.getQueryData(["plotfield", "commandIf", commandOrder.commandIfId, "insideElse"]);
      } else {
        await queryClient.cancelQueries({
          queryKey: ["plotfield", "commandIf", commandOrder.commandIfId, "insideElse"],
        });
        prevCommands = queryClient.getQueryData(["plotfield", "commandIf", commandOrder.commandIfId, "insideIf"]);
      }

      addCommandIf({
        commandIfId: commandOrder?.commandIfId || "",
        isElse: elseOrIf,
        newCommand: {
          commandOrder: commandOrder.commandOrder,
          _id: commandOrder._id,
          command: commandOrder?.command || ("" as AllPossiblePlotFieldComamndsTypes),
          isElse: elseOrIf,
          topologyBlockId: currentTopologyBlockId,
          commandIfId: commandOrder?.commandIfId || "",
          commandSide: "right",
          sayType: commandOrder.sayType,
        },
      });
      updateCommandIfInfo({
        addOrMinus: "add",
        commandIfId: commandOrder?.commandIfId || "",
        isElse: elseOrIf,
      });

      return { prevCommands };
    },
    onError: (err, newCommand, context) => {
      console.error(`Some error happened: ${err.message}`);

      removeCommandIfItem({
        id: newCommand._id,
        isElse: newCommand.isElse,
        commandIfId: newCommand.commandIfId || "",
      });
      updateCommandIfInfo({
        addOrMinus: "minus",
        commandIfId: newCommand?.commandIfId || "",
        isElse: newCommand.isElse,
      });

      if (newCommand.isElse) {
        queryClient.setQueryData(
          ["plotfield", "commandIf", newCommand.commandIfId, "insideElse"],
          context?.prevCommands
        );
      } else {
        queryClient.setQueryData(["plotfield", "commandIf", newCommand.commandIfId, "insideIf"], context?.prevCommands);
      }
    },
  });
}
