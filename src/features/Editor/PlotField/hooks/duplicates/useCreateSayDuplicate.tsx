import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import usePlotfieldCommandPossiblyBeingUndo from "../../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";

type CreateSayDuplicateTypes = {
  topologyBlockId: string;
  episodeId: string;
};

type CreateSayDuplicateOnMutation = {
  commandOrder: number;
  plotfieldCommandId: string;
  commandSide: "left" | "right";

  sayType?: CommandSayVariationTypes;
  characterId?: string;
  characterName?: string;
  characterImg?: string;

  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandName?: AllPossiblePlotFieldComamndsTypes;

  emotionName?: string;
  emotionId?: string;
  emotionImg?: string;
};

export default function useCreateSayDuplicate({
  topologyBlockId,
  episodeId,
}: CreateSayDuplicateTypes) {
  const {
    addCommand,
    updateCommandInfo,
    addCommandIf,
    updateCommandIfInfo,
    removeCommandIfItem,
  } = usePlotfieldCommands();
  const { setNewCommand } = usePlotfieldCommandPossiblyBeingUndo();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCommand: CreateSayDuplicateOnMutation) => {
      const {
        commandOrder,
        plotfieldCommandId,
        commandSide,
        sayType,
        characterId,
        emotionId,
        commandIfId,
        isElse,
        topologyBlockId: bodyTopologyBlockId,
      } = newCommand;
      const currentTopologyBlockId = bodyTopologyBlockId?.trim().length
        ? bodyTopologyBlockId
        : topologyBlockId;
      const response = await axiosCustomized.post(
        `/plotFieldCommands/say/topologyBlocks/${currentTopologyBlockId}/copy`,
        {
          commandOrder,
          plotfieldCommandId,
          commandSide,
          type: sayType,
          characterEmotionId: emotionId,
          characterId,
          commandIfId,
          isElse,
        }
      );
      return { data: response.data, plotfieldCommandId };
    },
    onMutate: async (newCommand: CreateSayDuplicateOnMutation) => {
      const currentTopologyBlockId = newCommand.topologyBlockId?.trim().length
        ? newCommand.topologyBlockId
        : topologyBlockId;
      if (newCommand.commandIfId?.trim().length) {
        let prevCommands;
        if (newCommand.isElse) {
          await queryClient.cancelQueries({
            queryKey: [
              "plotfield",
              "commandIf",
              newCommand.commandIfId,
              "insideElse",
            ],
          });
          prevCommands = queryClient.getQueryData([
            "plotfield",
            "commandIf",
            newCommand.commandIfId,
            "insideElse",
          ]);
        } else {
          await queryClient.cancelQueries({
            queryKey: [
              "plotfield",
              "commandIf",
              newCommand.commandIfId,
              "insideElse",
            ],
          });
          prevCommands = queryClient.getQueryData([
            "plotfield",
            "commandIf",
            newCommand.commandIfId,
            "insideIf",
          ]);
        }

        addCommandIf({
          commandIfId: newCommand.commandIfId || "",
          isElse: newCommand.isElse || false,
          newCommand: {
            commandOrder: newCommand.commandOrder,
            _id: newCommand.plotfieldCommandId,
            command:
              newCommand.commandName ||
              ("" as AllPossiblePlotFieldComamndsTypes),
            isElse: newCommand.isElse || false,
            topologyBlockId: currentTopologyBlockId,
            commandIfId: newCommand.commandIfId || "",

            characterId: newCommand.characterId,
            characterName: newCommand.characterName,
            characterImg: newCommand.characterImg,

            sayType: newCommand.sayType,

            commandSide: newCommand.commandSide,

            emotionId: newCommand.emotionId,
            emotionImg: newCommand.emotionImg,
            emotionName: newCommand.emotionName,
          },
        });

        setNewCommand({
          episodeId,
          topologyBlockId: currentTopologyBlockId,
          newCommand: {
            _id: newCommand.plotfieldCommandId,
            command:
              newCommand.commandName ||
              ("" as AllPossiblePlotFieldComamndsTypes),
            commandOrder: newCommand.commandOrder,
            topologyBlockId: currentTopologyBlockId,
            undoType: "copied",
            characterId: newCommand.characterId,
            emotionName: newCommand.emotionName,
            characterName: newCommand.characterName,
            sayType: newCommand.sayType,
            commandIfId: newCommand.commandIfId,
            isElse: newCommand.isElse,
            commandSide: newCommand.commandSide,
            characterImg: newCommand.characterImg,
            emotionId: newCommand.emotionId,
            emotionImg: newCommand.emotionImg,
          },
        });

        updateCommandIfInfo({
          addOrMinus: "add",
          commandIfId: newCommand.commandIfId || "",
          isElse: newCommand.isElse || false,
        });

        return { prevCommands };
      } else {
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
            _id: newCommand.plotfieldCommandId,
            command:
              (newCommand.commandName as AllPossiblePlotFieldComamndsTypes) ||
              "",
            commandOrder: newCommand.commandOrder,
            topologyBlockId: currentTopologyBlockId,
            sayType: newCommand?.sayType || ("" as CommandSayVariationTypes),
            commandSide: newCommand.commandSide,
            characterId: newCommand.characterId,
            characterImg: newCommand.characterImg,
            characterName: newCommand.characterName,
            commandIfId: newCommand.commandIfId,
            emotionId: newCommand.emotionId,
            emotionImg: newCommand.emotionImg,
            emotionName: newCommand.emotionName,
            isElse: newCommand.isElse,
          },
          topologyBlockId: currentTopologyBlockId,
        });

        setNewCommand({
          episodeId,
          topologyBlockId: currentTopologyBlockId,
          newCommand: {
            _id: newCommand.plotfieldCommandId,
            command:
              newCommand.commandName ||
              ("" as AllPossiblePlotFieldComamndsTypes),
            commandOrder: newCommand.commandOrder,
            topologyBlockId: currentTopologyBlockId,
            undoType: "copied",
            characterId: newCommand.characterId,
            emotionName: newCommand.emotionName,
            characterName: newCommand.characterName,
            sayType: newCommand.sayType,
            commandIfId: newCommand.commandIfId,
            isElse: newCommand.isElse,
            commandSide: newCommand.commandSide,
            characterImg: newCommand.characterImg,
            emotionId: newCommand.emotionId,
            emotionImg: newCommand.emotionImg,
          },
        });

        updateCommandInfo({
          addOrMinus: "add",
          topologyBlockId: currentTopologyBlockId,
        });

        return { prevCommands };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["plotfieldComamnd", data.plotfieldCommandId, "say"],
      });
    },
    onError: (err, newCommand, context) => {
      const { commandIfId, isElse, plotfieldCommandId } = newCommand;
      if (commandIfId?.trim().length) {
        console.error(`Some error happened: ${err.message}`);

        removeCommandIfItem({
          id: plotfieldCommandId,
          isElse: isElse || false,
          commandIfId,
        });
        updateCommandIfInfo({
          addOrMinus: "minus",
          commandIfId: commandIfId || "",
          isElse: isElse || false,
        });

        if (isElse) {
          queryClient.setQueryData(
            ["plotfield", "commandIf", commandIfId, "insideElse"],
            context?.prevCommands
          );
        } else {
          queryClient.setQueryData(
            ["plotfield", "commandIf", commandIfId, "insideIf"],
            context?.prevCommands
          );
        }
      } else {
        const currentTopologyBlockId = newCommand.topologyBlockId?.trim().length
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
      }
    },
  });
}
