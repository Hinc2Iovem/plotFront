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

// TODO maybe add generic to functions like addCommand
export default function useCreateSayWithCertainCharacter({
  plotFieldCommandId,
  topologyBlockId,
}: CreateSayCommandTypes) {
  const { addCommand, updateCommandInfo } = usePlotfieldCommands();
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
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : _id;
      const currentTopologyBlockId = bodyTopologyBlockId?.trim().length ? bodyTopologyBlockId : topologyBlockId;
      await axiosCustomized.post(`/plotField/${commandId}/topologyBlocks/${currentTopologyBlockId}/certainCharacter`, {
        characterId,
        characterName,
        commandName,
        commandOrder,
        commandIfId,
        isElse,
      });
    },
    onMutate: async (newCommand: NewCommandTypes) => {
      const currentTopologyBlockId = newCommand.topologyBlockId?.trim().length
        ? newCommand.topologyBlockId
        : topologyBlockId;

      await queryClient.cancelQueries({
        queryKey: ["plotfield", "topologyBlock", currentTopologyBlockId],
      });

      const prevCommands = queryClient.getQueryData(["plotfield", "topologyBlock", currentTopologyBlockId]);

      addCommand({
        newCommand: {
          _id: newCommand._id,
          command: (newCommand.commandName as AllPossiblePlotFieldComamndsTypes) || "",
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
    },
    onError: (err, newCommand, context) => {
      console.error(`Some error happened: ${err.message}`);

      const currentTopologyBlockId = newCommand.topologyBlockId?.trim().length
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
