import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import {
  CreateDuplicateOnMutation,
  CreateDuplicateWithStoryTypes,
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

export default function useCreateAchievementDuplicate({
  storyId,
  topologyBlockId,
  episodeId,
}: CreateDuplicateWithStoryTypes) {
  const { addCommand, updateCommandInfo } = usePlotfieldCommands();
  const { setNewCommand } = usePlotfieldCommandPossiblyBeingUndo();
  const queryClient = useQueryClient();
  const { addItem, deleteValue } = useSearch();

  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
      commandOrder,
      plotfieldCommandIfId,
      isElse,
      topologyBlockId: bodyTopologyBlockId,
    }: CreateDuplicateOnMutation) => {
      const currentTopologyBlockId = bodyTopologyBlockId?.trim().length ? bodyTopologyBlockId : topologyBlockId;
      await axiosCustomized
        .post(`/plotFieldCommands/commandAchievements/topologyBlocks/${currentTopologyBlockId}/copy`, {
          storyId,
          commandOrder,
          plotfieldCommandId,
          plotfieldCommandIfId,
          isElse,
        })
        .then((r) => r.data);
    },
    onMutate: async (newCommand: CreateDuplicateOnMutation) => {
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
        plotfieldCommandIfId: newCommand.plotfieldCommandIfId || "",
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
