import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import {
  CreateDuplicateSayOnMutationTypes,
  CreateDuplicateTypes,
} from "../../../../../hooks/helpers/Plotfield/Duplication/createDuplicateTypes";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useSearch from "../../../Context/Search/SearchContext";
import usePlotfieldCommandPossiblyBeingUndo from "../../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import {
  handleDuplicationOptimisticOnError,
  handleDuplicationOptimisticOnMutation,
} from "./helpers/handleDuplicationOptimistic";

export default function useCreateSayDuplicate({ topologyBlockId, episodeId }: CreateDuplicateTypes) {
  const { addCommand, updateCommandInfo } = usePlotfieldCommands();
  const { setNewCommand } = usePlotfieldCommandPossiblyBeingUndo();
  const queryClient = useQueryClient();
  const { addItem, deleteValue } = useSearch();

  return useMutation({
    mutationFn: async (newCommand: CreateDuplicateSayOnMutationTypes) => {
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
      const currentTopologyBlockId = bodyTopologyBlockId?.trim().length ? bodyTopologyBlockId : topologyBlockId;
      await axiosCustomized
        .post(`/plotFieldCommands/say/topologyBlocks/${currentTopologyBlockId}/copy`, {
          commandOrder,
          plotfieldCommandId,
          commandSide,
          type: sayType,
          characterEmotionId: emotionId,
          characterId,
          commandIfId,
          isElse,
        })
        .then((r) => r.data);
      // return { data: response.data, plotfieldCommandId };
    },
    onMutate: async (newCommand: CreateDuplicateSayOnMutationTypes) => {
      addItem({
        episodeId,
        item: {
          commandName: newCommand.commandName || "command",
          id: newCommand.plotfieldCommandId,
          text: "",
          topologyBlockId: newCommand.topologyBlockId?.trim().length ? newCommand.topologyBlockId : topologyBlockId,
          type: "command",
        },
      });
      const prevCommands = await handleDuplicationOptimisticOnMutation({
        addCommand,
        characterId: newCommand.characterId || "",
        characterName: newCommand.characterName || "",
        commandIfId: newCommand.commandIfId || "",
        commandName: newCommand.commandName || ("" as AllPossiblePlotFieldComamndsTypes),
        commandOrder: newCommand.commandOrder,
        emotionName: newCommand.emotionName || "",
        episodeId: episodeId,
        isElse: newCommand.isElse || false,
        plotfieldCommandId: newCommand.plotfieldCommandId,
        queryClient,
        sayType: newCommand.sayType || ("" as CommandSayVariationTypes),
        topologyBlockId: newCommand.topologyBlockId?.trim().length ? newCommand.topologyBlockId : topologyBlockId,
        setNewCommand,
        updateCommandInfo,
      });
      return { prevCommands };
    },
    onError: (err, newCommand, context) => {
      deleteValue({ id: newCommand.plotfieldCommandId, episodeId });
      handleDuplicationOptimisticOnError({
        prevCommands: context?.prevCommands,
        queryClient,
        topologyBlockId: newCommand.topologyBlockId?.trim().length ? newCommand.topologyBlockId : topologyBlockId,
        updateCommandInfo,
        message: err.message,
      });
    },
  });
}
