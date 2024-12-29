import {
  CurrentlyFocusedCommandTypes,
  CurrentlyFocusedVariationTypes,
} from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { PlotfieldOptimisticCommandTypes } from "../../../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import { OmittedCommandNames } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";

type NavigationBackAndForthTypes = {
  key: string;
  currentlyFocusedCommandId: CurrentlyFocusedCommandTypes;
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
  removeItem: <K extends keyof SessionStorageKeys>(key: K) => void;
  hasItem: <K extends keyof SessionStorageKeys>(key: K) => boolean;
  getPreviousCommandByPlotfieldId: ({
    plotfieldCommandId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getNextCommandByPlotfieldId: ({
    plotfieldCommandId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    topologyBlockId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getCommandsByTopologyBlockId: ({ topologyBlockId }: { topologyBlockId: string }) => PlotfieldOptimisticCommandTypes[];
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  setCurrentlyFocusedCommandId: ({
    currentlyFocusedCommandId,
    isElse,
    type,
    commandName,
    commandOrder,
    parentId,
  }: {
    currentlyFocusedCommandId: string;
    parentId?: string;
    isElse?: boolean;
    type: CurrentlyFocusedVariationTypes;
    commandName: OmittedCommandNames;
    commandOrder: number;
  }) => void;
};

export default function navigationBackAndForth({
  getItem,
  getNextCommandByPlotfieldId,
  getPreviousCommandByPlotfieldId,
  hasItem,
  removeItem,
  setCurrentlyFocusedCommandId,
  setItem,
  getCommandsByTopologyBlockId,
  getCommandOnlyByPlotfieldCommandId,
  key,
  currentlyFocusedCommandId,
}: NavigationBackAndForthTypes) {
  const focusedCommand = getItem("focusedCommand") || "";
  const currentTopologyBlock = getItem("focusedTopologyBlock") || "";
  const parentId = getItem("focusedCommandParentId") || "";

  if (key === "arrowup") {
    const prevCommand = getPreviousCommandByPlotfieldId({
      plotfieldCommandId: focusedCommand,
      topologyBlockId: currentTopologyBlock,
    });

    if (!prevCommand) {
      console.log("prev command wasn't found");
      return;
    }

    setCurrentlyFocusedCommandId({
      currentlyFocusedCommandId: prevCommand._id,
      type: "command",
      commandName: prevCommand.command as OmittedCommandNames,
      commandOrder: prevCommand.commandOrder,
      isElse: prevCommand.isElse,
      parentId: prevCommand.plotfieldCommandIfId || parentId,
    });

    setItem("focusedCommand", `${prevCommand._id}`);
    setItem("focusedCommandType", `command`);
    setItem("focusedCommandOrder", prevCommand.commandOrder);
    setItem("focusedCommandName", prevCommand.command);
    if (typeof prevCommand.isElse === "boolean" || prevCommand.command === "end") {
      setItem("focusedCommandParentId", prevCommand.plotfieldCommandIfId || parentId);
    } else if (hasItem("focusedCommandParentId")) {
      removeItem("focusedCommandParentId");
    }
    if (prevCommand.command === "condition") {
      setItem("focusedConditionIsElse", true);
      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: prevCommand._id,
        type: "command",
        commandName: "condition",
        commandOrder: prevCommand.commandOrder,
        isElse: true,
        parentId: prevCommand._id,
      });
    }
  } else if (key === "arrowdown") {
    // Going Down To The First Command From The Start
    console.log("currentlyFocusedCommandId: ", currentlyFocusedCommandId);
    if (!currentlyFocusedCommandId._id) {
      console.log("down to the first command");
      const currentCommand = getCommandsByTopologyBlockId({
        topologyBlockId: currentTopologyBlock || "",
      })[0];

      console.log("commandsTop: ", getCommandsByTopologyBlockId({ topologyBlockId: currentTopologyBlock || "" }));

      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: currentCommand._id,
        type: "command",
        commandName: currentCommand.command as OmittedCommandNames,
        commandOrder: currentCommand.commandOrder,
      });

      setItem("focusedCommand", `${currentCommand._id}`);
      setItem("focusedCommandType", `command`);
      setItem("focusedCommandOrder", currentCommand.commandOrder);
      setItem("focusedCommandName", currentCommand.command);
      if (currentCommand.command === "condition") {
        setItem("focusedConditionIsElse", false);
      }
    } else {
      const currentCommand = getCommandOnlyByPlotfieldCommandId({ plotfieldCommandId: focusedCommand });

      if (currentCommand?.command === "condition") {
        const focusedConditionIsElse = getItem("focusedConditionIsElse") || false;
        if (!focusedConditionIsElse) {
          setItem("focusedConditionIsElse", true);

          setCurrentlyFocusedCommandId({
            currentlyFocusedCommandId: focusedCommand,
            type: "command",
            commandName: "condition",
            commandOrder: currentCommand.commandOrder,
            isElse: true,
            parentId: currentCommand._id,
          });
          return;
        } else {
          setItem("focusedConditionIsElse", false);
        }
      }

      // going down to the next command
      const nextCommand = getNextCommandByPlotfieldId({
        plotfieldCommandId: focusedCommand,
        topologyBlockId: currentTopologyBlock,
      });

      if (!nextCommand) {
        console.log("next command wasn't found");
        return;
      }

      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: nextCommand._id,
        type: "command",
        commandName: nextCommand.command as OmittedCommandNames,
        commandOrder: nextCommand.commandOrder,
        isElse: nextCommand.isElse,
        parentId: nextCommand.plotfieldCommandIfId || parentId,
      });

      setItem("focusedCommand", `${nextCommand._id}`);
      setItem("focusedCommandType", `command`);
      setItem("focusedCommandOrder", nextCommand.commandOrder);
      setItem("focusedCommandName", nextCommand.command);
      if (typeof nextCommand.isElse === "boolean") {
        setItem("focusedCommandParentId", nextCommand.plotfieldCommandIfId || parentId);
      } else if (hasItem("focusedCommandParentId")) {
        removeItem("focusedCommandParentId");
      }
    }
  }
}
