import { QueryClient } from "@tanstack/react-query";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { PlotfieldOptimisticUndoCommandTypes } from "../../../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";
import { UpdateCommandInfoSignType } from "../../../Context/PlotfieldCommandInfoSlice";
import { PlotfieldOptimisticCommandTypes } from "../../../Context/PlotfieldCommandSlice";

type HandleDuplicationOptimisticOnMutationTypes = {
  setNewCommand: ({
    episodeId,
    newCommand,
    topologyBlockId,
  }: {
    newCommand: PlotfieldOptimisticUndoCommandTypes;
    episodeId: string;
    topologyBlockId: string;
  }) => void;
  addCommand: ({
    newCommand,
    topologyBlockId,
  }: {
    newCommand: PlotfieldOptimisticCommandTypes;
    topologyBlockId: string;
  }) => void;
  updateCommandInfo: ({
    addOrMinus,
    topologyBlockId,
  }: {
    topologyBlockId: string;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
  queryClient: QueryClient;
  isElse: boolean;
  topologyBlockId: string;
  commandName: AllPossiblePlotFieldComamndsTypes;
  sayType: CommandSayVariationTypes;
  plotfieldCommandIfId: string;
  characterName: string;
  emotionName: string;
  characterId: string;
  commandOrder: number;
  plotfieldCommandId: string;
  episodeId: string;

  characterImg?: string;
  commandSide?: "left" | "right";
  emotionId?: string;
  emotionImg?: string;
};

export async function handleDuplicationOptimisticOnMutation({
  queryClient,
  topologyBlockId,
  commandName,
  isElse,
  sayType,
  characterName,
  emotionName,
  characterId,
  commandOrder,
  plotfieldCommandId,
  episodeId,
  plotfieldCommandIfId,
  commandSide,
  characterImg,
  emotionId,
  emotionImg,
  addCommand,
  setNewCommand,
  updateCommandInfo,
}: HandleDuplicationOptimisticOnMutationTypes) {
  await queryClient.cancelQueries({
    queryKey: ["plotfield", "topologyBlock", topologyBlockId],
  });

  const prevCommands = queryClient.getQueryData(["plotfield", "topologyBlock", topologyBlockId]);

  // TODO add plotfieldCommandIfId
  // search
  addCommand({
    newCommand: {
      _id: plotfieldCommandId,
      command: (commandName as AllPossiblePlotFieldComamndsTypes) || "",
      commandOrder: commandOrder,
      topologyBlockId,
      sayType: sayType || ("" as CommandSayVariationTypes),

      commandSide: commandSide,
      characterId: characterId,
      characterImg: characterImg,
      characterName: characterName,
      plotfieldCommandIfId: plotfieldCommandIfId,
      emotionId: emotionId,
      emotionImg: emotionImg,
      emotionName: emotionName,
      isElse: isElse,
    },
    topologyBlockId,
  });

  // undoCommand
  setNewCommand({
    episodeId,
    topologyBlockId,
    newCommand: {
      _id: plotfieldCommandId,
      command: commandName || ("" as AllPossiblePlotFieldComamndsTypes),
      commandOrder: commandOrder,
      topologyBlockId,
      undoType: "created",
      characterId: characterId,
      emotionName: emotionName,
      characterName: characterName,
      sayType: sayType,
      isElse: isElse,

      commandSide: commandSide,
      characterImg: characterImg,
      emotionId: emotionId,
      emotionImg: emotionImg,
    },
  });

  // plotfieldCommands(info)
  updateCommandInfo({ addOrMinus: "add", topologyBlockId });

  return { prevCommands };
}

type HandleDuplicationOptimisticOnErrorTypes = {
  queryClient: QueryClient;
  topologyBlockId: string;
  prevCommands:
    | {
        prevCommands: unknown;
      }
    | undefined;
  updateCommandInfo: ({
    addOrMinus,
    topologyBlockId,
  }: {
    topologyBlockId: string;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
  message: string;
};

export async function handleDuplicationOptimisticOnError({
  queryClient,
  topologyBlockId,
  prevCommands,
  message,
  updateCommandInfo,
}: HandleDuplicationOptimisticOnErrorTypes) {
  console.error(`Some error happened: ${message}`);
  updateCommandInfo({ addOrMinus: "minus", topologyBlockId });
  queryClient.setQueryData(["plotfield", "topologyBlock", topologyBlockId], prevCommands);
}
