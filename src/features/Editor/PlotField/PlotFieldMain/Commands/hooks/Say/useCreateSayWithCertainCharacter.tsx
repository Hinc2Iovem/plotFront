import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import usePlotfieldCommands from "../../../../Context/PlotFieldContext";
import { CommandSayVariationTypes } from "../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CreateSayCommandTypes = {
  plotFieldCommandId?: string;
  topologyBlockId: string;
};

type NewCommandTypes = {
  _id: string;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandOrder: number;
  commandName?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterName: string;
  characterId: string;
};

export default function useCreateSayWithCertainCharacter({
  plotFieldCommandId,
  topologyBlockId,
}: CreateSayCommandTypes) {
  const { addCommand } = usePlotfieldCommands();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      _id,
      characterId,
      characterName,
      commandName,
      commandOrder,
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : _id;
      await axiosCustomized.post(
        `/plotField/${commandId}/topologyBlocks/${topologyBlockId}/certainCharacter`,
        {
          characterId,
          characterName,
          commandName,
          commandOrder,
        }
      );
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
          command:
            (newCommand.commandName as AllPossiblePlotFieldComamndsTypes) || "",
          commandOrder: newCommand.commandOrder,
          topologyBlockId,
          sayType: newCommand?.sayType || ("" as CommandSayVariationTypes),
          characterName: newCommand?.characterName || "",
          characterId: newCommand?.characterId || "",
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
