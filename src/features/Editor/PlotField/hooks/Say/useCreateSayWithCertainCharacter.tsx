import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import { CommandSayVariationTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CreateSayCommandTypes = {
  plotFieldCommandId?: string;
  topologyBlockId: string;
  commandIfId?: string;
};

type NewCommandTypes = {
  _id: string;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandName?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterName: string;
  characterId: string;
  commandOrder: number;
};

export default function useCreateSayWithCertainCharacter({
  plotFieldCommandId,
  topologyBlockId,
}: CreateSayCommandTypes) {
  const {
    addCommand,
    updateCommandInfo,
    removeCommandIfItem,
    updateCommandIfInfo,
    addCommandIf,
  } = usePlotfieldCommands();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      _id,
      characterId,
      characterName,
      commandName,
      isElse,
      commandIfId,
      commandOrder,
      topologyBlockId: bodyTopologyBlockId,
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : _id;
      const currentTopologyBlockId = bodyTopologyBlockId?.trim().length
        ? bodyTopologyBlockId
        : topologyBlockId;
      await axiosCustomized.post(
        `/plotField/${commandId}/topologyBlocks/${currentTopologyBlockId}/certainCharacter`,
        {
          characterId,
          characterName,
          commandName,
          commandOrder,
          commandIfId,
          isElse,
        }
      );
    },
    onMutate: async (newCommand: NewCommandTypes) => {
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
          commandIfId: newCommand?.commandIfId || "",
          isElse: newCommand.isElse || false,
          newCommand: {
            _id: newCommand._id,
            commandOrder: newCommand.commandOrder,
            command:
              newCommand?.commandName ||
              ("" as AllPossiblePlotFieldComamndsTypes),
            isElse: newCommand.isElse || false,
            topologyBlockId: currentTopologyBlockId,
            commandIfId: newCommand?.commandIfId || "",
            sayType: newCommand?.sayType || ("" as CommandSayVariationTypes),
            characterName: newCommand?.characterName || "",
            characterId: newCommand?.characterId || "",
            commandSide: "right",
          },
        });
        updateCommandIfInfo({
          addOrMinus: "add",
          commandIfId: newCommand?.commandIfId || "",
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
            _id: newCommand._id,
            command:
              (newCommand.commandName as AllPossiblePlotFieldComamndsTypes) ||
              "",
            commandOrder: newCommand.commandOrder,
            topologyBlockId: currentTopologyBlockId,
            sayType: newCommand?.sayType || ("" as CommandSayVariationTypes),
            characterName: newCommand?.characterName || "",
            characterId: newCommand?.characterId || "",
            commandSide: "right",
          },
          topologyBlockId: currentTopologyBlockId,
        });
        updateCommandInfo({
          addOrMinus: "add",
          topologyBlockId: currentTopologyBlockId,
        });

        return { prevCommands };
      }
    },
    onError: (err, newCommand, context) => {
      console.error(`Some error happened: ${err.message}`);
      if (newCommand.commandIfId?.trim().length) {
        removeCommandIfItem({
          id: newCommand._id,
          isElse: newCommand.isElse || false,
          commandIfId: newCommand.commandIfId,
        });
        updateCommandIfInfo({
          addOrMinus: "minus",
          commandIfId: newCommand?.commandIfId || "",
          isElse: newCommand.isElse || false,
        });

        if (newCommand.isElse) {
          queryClient.setQueryData(
            ["plotfield", "commandIf", newCommand.commandIfId, "insideElse"],
            context?.prevCommands
          );
        } else {
          queryClient.setQueryData(
            ["plotfield", "commandIf", newCommand.commandIfId, "insideIf"],
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
