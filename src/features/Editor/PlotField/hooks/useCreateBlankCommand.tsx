import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import {
  AllPossiblePlotFieldComamndsTypes,
  PlotFieldTypes,
} from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import usePlotfieldCommandPossiblyBeingUndo from "../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";
import useSearch from "../../Context/Search/SearchContext";

type NewCommandTypes = {
  _id: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandName?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;

  commandOrder?: number;
  plotfieldCommandIfId?: string;
  plotfieldCommandElseId?: string;
  plotfieldCommandIfElseEndId?: string;
};

export default function useCreateBlankCommand({
  topologyBlockId,
  episodeId,
  commandOrder,
}: {
  topologyBlockId: string;
  episodeId: string;
  commandOrder?: number;
}) {
  const { addCommand, updateCommandInfo } = usePlotfieldCommands();
  const { addItem } = useSearch();
  const { setNewCommand } = usePlotfieldCommandPossiblyBeingUndo();

  const queryClient = useQueryClient();
  // TODO need to add here if checks, what command creates, and create according state, for example, if commandIf, we will create command else and command end with it

  return useMutation({
    mutationKey: ["new", "plotfield", "topologyBlock", topologyBlockId],
    mutationFn: async (newCommand) => {
      const currentCommandOrder = typeof commandOrder === "number" ? commandOrder : newCommand.commandOrder;
      const currentTopologyBlockId = newCommand?.topologyBlockId?.trim().length
        ? newCommand.topologyBlockId
        : topologyBlockId;

      return await axiosCustomized
        .post<PlotFieldTypes>(`/plotField/topologyBlocks/${currentTopologyBlockId}`, {
          commandOrder: currentCommandOrder,
          _id: newCommand._id,
          commandName: newCommand.commandName,
          plotfieldCommandIfId: newCommand.plotfieldCommandIfId,
          isElse: newCommand.isElse,
        })
        .then((r) => r.data);
    },
    onMutate: async (newCommand: NewCommandTypes) => {
      const currentCommandOrder = typeof commandOrder === "number" ? commandOrder : newCommand.commandOrder;
      const currentTopologyBlockId = newCommand?.topologyBlockId?.trim().length
        ? newCommand.topologyBlockId
        : topologyBlockId;

      // search
      addItem({
        episodeId,
        item: {
          commandName:
            newCommand.commandName === "say" ? newCommand.sayType || "author" : newCommand.commandName || "command",
          type: "command",
          id: newCommand._id,
          text: newCommand.commandName === "say" ? newCommand.sayType || "author" : "",
          topologyBlockId: currentTopologyBlockId,
        },
      });

      await queryClient.cancelQueries({
        queryKey: ["plotfield", "topologyBlock", currentTopologyBlockId],
      });

      const prevCommands = queryClient.getQueryData(["plotfield", "topologyBlock", currentTopologyBlockId]);

      addCommand({
        newCommand: {
          _id: newCommand._id,
          command: (newCommand.commandName as AllPossiblePlotFieldComamndsTypes) || "",
          commandOrder: currentCommandOrder || 0,
          topologyBlockId: currentTopologyBlockId,
          sayType: newCommand?.sayType || ("" as CommandSayVariationTypes),
          isElse: newCommand.isElse,

          plotfieldCommandIfId: newCommand.plotfieldCommandIfId,
        },
        topologyBlockId: currentTopologyBlockId,
        plotfieldCommandElseId: newCommand.plotfieldCommandElseId,
        plotfieldCommandIfElseEndId: newCommand.plotfieldCommandIfElseEndId,
        plotfieldCommandIfId: newCommand.plotfieldCommandIfId,
        isElse: newCommand.isElse,
      });

      setNewCommand({
        episodeId,
        topologyBlockId: currentTopologyBlockId,
        newCommand: {
          _id: newCommand._id,
          command: newCommand.commandName || ("" as AllPossiblePlotFieldComamndsTypes),
          commandOrder: currentCommandOrder || 0,
          topologyBlockId: currentTopologyBlockId,
          undoType: "created",
          characterId: "",
          emotionName: "",
          characterName: "",
          sayType: newCommand.sayType,
          isElse: newCommand.isElse,

          plotfieldCommandIfId: newCommand.plotfieldCommandIfId,
        },
      });

      updateCommandInfo({
        addOrMinus: "add",
        topologyBlockId: currentTopologyBlockId,
      });

      return { prevCommands };
    },
    onError: (err, newCommand, context) => {
      console.error("Error: ", err.message);

      const currentTopologyBlockId = newCommand?.topologyBlockId?.trim().length
        ? newCommand.topologyBlockId
        : topologyBlockId;

      updateCommandInfo({
        addOrMinus: "minus",
        topologyBlockId: currentTopologyBlockId,
      });
      queryClient.setQueryData(["plotfield", "topologyBlock", currentTopologyBlockId], context?.prevCommands);
    },
  });
}
