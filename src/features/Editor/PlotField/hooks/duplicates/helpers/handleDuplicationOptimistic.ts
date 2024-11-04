import { QueryClient } from "@tanstack/react-query";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { PlotfieldOptimisticUndoCommandTypes } from "../../../Context/CommandsPossiblyBeingUndo/PlotfieldCommandsPossiblyBeingUndo";
import { UpdateCommandInfoSignType } from "../../../Context/PlotfieldCommandInfoSlice";
import { PlotfieldOptimisticCommandTypes } from "../../../Context/PlotfieldCommandSlice";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../Context/PlotfieldCommandIfSlice";

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
  commandIfId: string;
  characterName: string;
  emotionName: string;
  characterId: string;
  commandOrder: number;
  plotfieldCommandId: string;
  episodeId: string;
  addCommandIf: ({
    commandIfId,
    newCommand,
    isElse,
  }: {
    newCommand: PlotfieldOptimisticCommandInsideIfTypes;
    commandIfId: string;
    isElse: boolean;
  }) => void;
  updateCommandIfInfo: ({
    addOrMinus,
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
};

export async function handleDuplicationOptimisticOnMutation({
  queryClient,
  topologyBlockId,
  commandName,
  isElse,
  sayType,
  commandIfId,
  characterName,
  emotionName,
  characterId,
  commandOrder,
  plotfieldCommandId,
  episodeId,
  addCommand,
  setNewCommand,
  updateCommandInfo,
  addCommandIf,
  updateCommandIfInfo,
}: HandleDuplicationOptimisticOnMutationTypes) {
  if (commandIfId?.trim().length) {
    let prevCommands;
    if (isElse) {
      await queryClient.cancelQueries({
        queryKey: ["plotfield", "commandIf", commandIfId, "insideElse"],
      });
      prevCommands = queryClient.getQueryData([
        "plotfield",
        "commandIf",
        commandIfId,
        "insideElse",
      ]);
    } else {
      await queryClient.cancelQueries({
        queryKey: ["plotfield", "commandIf", commandIfId, "insideIf"],
      });
      prevCommands = queryClient.getQueryData([
        "plotfield",
        "commandIf",
        commandIfId,
        "insideIf",
      ]);
    }

    addCommandIf({
      commandIfId: commandIfId || "",
      isElse: isElse,
      newCommand: {
        commandOrder: commandOrder,
        _id: plotfieldCommandId,
        command: commandName || ("" as AllPossiblePlotFieldComamndsTypes),
        isElse: isElse,
        topologyBlockId,
        commandIfId: commandIfId || "",
        commandSide: "right",
        characterId,
        characterName,
        emotionName,
        sayType,
      },
    });

    setNewCommand({
      episodeId,
      topologyBlockId,
      newCommand: {
        _id: plotfieldCommandId,
        command: commandName || ("" as AllPossiblePlotFieldComamndsTypes),
        commandOrder: commandOrder,
        topologyBlockId,
        undoType: "copied",
        characterId: characterId,
        emotionName: emotionName,
        characterName: characterName,
        sayType: sayType,
        commandIfId: commandIfId,
        isElse: isElse,
      },
    });

    updateCommandIfInfo({
      addOrMinus: "add",
      commandIfId: commandIfId || "",
      isElse: isElse,
    });

    return { prevCommands };
  } else {
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
        _id: plotfieldCommandId,
        command: (commandName as AllPossiblePlotFieldComamndsTypes) || "",
        commandOrder: commandOrder,
        topologyBlockId,
        sayType: sayType || ("" as CommandSayVariationTypes),
      },
      topologyBlockId,
    });

    setNewCommand({
      episodeId,
      topologyBlockId,
      newCommand: {
        _id: plotfieldCommandId,
        command: commandName || ("" as AllPossiblePlotFieldComamndsTypes),
        commandOrder: commandOrder,
        topologyBlockId,
        undoType: "copied",
        characterId: characterId,
        emotionName: emotionName,
        characterName: characterName,
        sayType: sayType,
        commandIfId: commandIfId,
        isElse: isElse,
      },
    });

    updateCommandInfo({ addOrMinus: "add", topologyBlockId });

    return { prevCommands };
  }
}

type HandleDuplicationOptimisticOnErrorTypes = {
  queryClient: QueryClient;
  topologyBlockId: string;
  prevCommands:
    | {
        prevCommands: unknown;
      }
    | undefined;
  commandIfId: string;
  updateCommandInfo: ({
    addOrMinus,
    topologyBlockId,
  }: {
    topologyBlockId: string;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
  message: string;
  isElse: boolean;
  plotfieldCommandId: string;
  removeCommandIfItem: ({
    isElse,
    id,
    commandIfId,
  }: {
    isElse: boolean;
    id: string;
    commandIfId: string;
  }) => void;
  updateCommandIfInfo: ({
    addOrMinus,
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
    addOrMinus: UpdateCommandInfoSignType;
  }) => void;
};

export async function handleDuplicationOptimisticOnError({
  commandIfId,
  queryClient,
  topologyBlockId,
  prevCommands,
  isElse,
  message,
  plotfieldCommandId,
  removeCommandIfItem,
  updateCommandIfInfo,
  updateCommandInfo,
}: HandleDuplicationOptimisticOnErrorTypes) {
  if (commandIfId?.trim().length) {
    console.error(`Some error happened: ${message}`);

    removeCommandIfItem({
      id: plotfieldCommandId,
      isElse: isElse,
      commandIfId,
    });
    updateCommandIfInfo({
      addOrMinus: "minus",
      commandIfId: commandIfId || "",
      isElse: isElse,
    });

    if (isElse) {
      queryClient.setQueryData(
        ["plotfield", "commandIf", commandIfId, "insideElse"],
        prevCommands
      );
    } else {
      queryClient.setQueryData(
        ["plotfield", "commandIf", commandIfId, "insideIf"],
        prevCommands
      );
    }
  } else {
    updateCommandInfo({ addOrMinus: "minus", topologyBlockId });
    queryClient.setQueryData(
      ["plotfield", "topologyBlock", topologyBlockId],
      prevCommands
    );
  }
}
