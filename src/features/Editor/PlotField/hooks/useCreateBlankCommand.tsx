import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import {
  AllPossiblePlotFieldComamndsTypes,
  PlotFieldTypes,
} from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";
import usePlotfieldCommands from "../Context/PlotFieldContext";
import usePlotfieldCommandPossiblyBeingUndo from "../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";

type NewCommandTypes = {
  _id: string;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandName?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
};

export default function useCreateBlankCommand({
  topologyBlockId,
  episodeId,
}: {
  topologyBlockId: string;
  episodeId: string;
}) {
  const {
    addCommand,
    updateCommandInfo,
    getCurrentAmountOfCommands,
    getCommandByPlotfieldCommandId,
  } = usePlotfieldCommands();
  const { setNewCommand } = usePlotfieldCommandPossiblyBeingUndo();
  const currentTopologyBlock = sessionStorage.getItem(`focusedTopologyBlock`);
  const currentCommand = sessionStorage.getItem(`focusedCommand`)?.split("-");

  let valueOrNull = null;
  const currentCommandId = (currentCommand || [])[1];
  if (currentTopologyBlock === currentCommandId) {
    valueOrNull = null;
  } else {
    valueOrNull = getCommandByPlotfieldCommandId({
      plotfieldCommandId: currentCommandId,
      topologyBlockId: currentTopologyBlock?.trim().length
        ? currentTopologyBlock
        : topologyBlockId,
    })?.commandOrder;
  }

  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["new", "plotfield", "topologyBlock", topologyBlockId],
    mutationFn: async (commandOrder) => {
      const currentTopologyBlockId = commandOrder?.topologyBlockId?.trim()
        .length
        ? commandOrder.topologyBlockId
        : topologyBlockId;
      return await axiosCustomized
        .post<PlotFieldTypes>(
          `/plotField/topologyBlocks/${currentTopologyBlockId}`,
          {
            commandOrder:
              typeof valueOrNull === "number"
                ? valueOrNull + 1
                : getCurrentAmountOfCommands({
                    topologyBlockId: currentTopologyBlockId,
                  }) === 1
                ? 0
                : getCurrentAmountOfCommands({
                    topologyBlockId: currentTopologyBlockId,
                  }) - 1,
            _id: commandOrder._id,
            commandName: commandOrder.commandName,
          }
        )
        .then((r) => r.data);
    },
    onMutate: async (newCommand: NewCommandTypes) => {
      const currentTopologyBlockId = newCommand?.topologyBlockId?.trim().length
        ? newCommand.topologyBlockId
        : topologyBlockId;
      await queryClient.cancelQueries({
        queryKey: ["plotfield", "topologyBlock", currentTopologyBlockId],
      });

      const prevCommands = queryClient.getQueryData([
        "plotfield",
        "topologyBlock",
        currentTopologyBlockId,
      ]);

      addCommand({
        newCommand: {
          _id: newCommand._id,
          command:
            (newCommand.commandName as AllPossiblePlotFieldComamndsTypes) || "",
          commandOrder:
            typeof valueOrNull === "number"
              ? valueOrNull + 1
              : getCurrentAmountOfCommands({
                  topologyBlockId: currentTopologyBlockId,
                }),
          topologyBlockId: currentTopologyBlockId,
          sayType: newCommand?.sayType || ("" as CommandSayVariationTypes),
          isElse: newCommand.isElse,
          commandIfId: newCommand.commandIfId,
        },
        topologyBlockId: currentTopologyBlockId,
      });

      setNewCommand({
        episodeId,
        topologyBlockId: currentTopologyBlockId,
        newCommand: {
          _id: newCommand._id,
          command:
            newCommand.commandName || ("" as AllPossiblePlotFieldComamndsTypes),
          commandOrder:
            typeof valueOrNull === "number"
              ? valueOrNull + 1
              : getCurrentAmountOfCommands({
                  topologyBlockId: currentTopologyBlockId,
                }),
          topologyBlockId: currentTopologyBlockId,
          undoType: "created",
          characterId: "",
          emotionName: "",
          characterName: "",
          sayType: newCommand.sayType,
          commandIfId: newCommand.commandIfId,
          isElse: newCommand.isElse,
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
      queryClient.setQueryData(
        ["plotfield", "topologyBlock", currentTopologyBlockId],
        context?.prevCommands
      );
    },
  });
}
