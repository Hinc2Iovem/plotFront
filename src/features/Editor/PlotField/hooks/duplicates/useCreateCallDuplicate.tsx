import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import usePlotfieldCommandPossiblyBeingUndo from "../../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";
import usePlotfieldCommands from "../../Context/PlotFieldContext";
import {
  handleDuplicationOptimisticOnError,
  handleDuplicationOptimisticOnMutation,
} from "./helpers/handleDuplicationOptimistic";
import useSearch from "../../PlotFieldMain/Search/SearchContext";

type CreateCallDuplicateTypes = {
  topologyBlockId: string;
  episodeId: string;
};

type CreateCallDuplicateOnMutation = {
  commandOrder: number;
  commandIfId?: string;
  isElse?: boolean;
  topologyBlockId: string;
  commandName?: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes;
  characterId?: string;
  emotionName?: string;
  characterName?: string;
  plotfieldCommandId: string;
};

export default function useCreateCallDuplicate({ topologyBlockId, episodeId }: CreateCallDuplicateTypes) {
  const { addCommand, updateCommandInfo, addCommandIf, updateCommandIfInfo, removeCommandIfItem } =
    usePlotfieldCommands();
  const { setNewCommand } = usePlotfieldCommandPossiblyBeingUndo();
  const queryClient = useQueryClient();
  const { addItem, deleteValue } = useSearch();

  return useMutation({
    mutationFn: async ({
      commandOrder,
      plotfieldCommandId,
      commandIfId,
      isElse,
      topologyBlockId: bodyTopologyBlockId,
    }: CreateCallDuplicateOnMutation) => {
      const currentTopologyBlockId = bodyTopologyBlockId?.trim().length ? bodyTopologyBlockId : topologyBlockId;
      await axiosCustomized
        .post(`/plotFieldCommands/calls/topologyBlocks/${currentTopologyBlockId}/copy`, {
          commandOrder,
          plotfieldCommandId,
          commandIfId,
          isElse,
        })
        .then((r) => r.data);
    },
    onMutate: async (newCommand: CreateCallDuplicateOnMutation) => {
      addItem({
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
        addCommandIf,
        updateCommandIfInfo,
      });
      return { prevCommands };
    },
    onError: (err, newCommand, context) => {
      deleteValue({ id: newCommand.plotfieldCommandId });
      handleDuplicationOptimisticOnError({
        commandIfId: newCommand.commandIfId || "",
        prevCommands: context?.prevCommands,
        queryClient,
        topologyBlockId: newCommand.topologyBlockId?.trim().length ? newCommand.topologyBlockId : topologyBlockId,
        updateCommandInfo,
        isElse: newCommand.isElse || false,
        message: err.message,
        plotfieldCommandId: newCommand.plotfieldCommandId,
        removeCommandIfItem,
        updateCommandIfInfo,
      });
    },
  });
}
