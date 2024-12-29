import { CurrentlyFocusedVariationTypes } from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { PlotfieldOptimisticCommandTypes } from "../../../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import { OmittedCommandNames } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";

type DashInsideCommandIfTypes = {
  focusedCommandParentId: string;
  focusedCommand: string;
  key: string;
  currentCommand: PlotfieldOptimisticCommandTypes;
  getCommandByPlotfieldCommandIfId: ({
    plotfieldCommandIfId,
    elseOrEnd,
  }: {
    plotfieldCommandIfId: string;
    elseOrEnd: "else" | "end";
  }) => PlotfieldOptimisticCommandTypes | null;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
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

export default function dashInsideCommandIf({
  currentCommand,
  focusedCommand,
  focusedCommandParentId,
  key,
  setCurrentlyFocusedCommandId,
  getCommandOnlyByPlotfieldCommandId,
  getCommandByPlotfieldCommandIfId,
  setItem,
}: DashInsideCommandIfTypes) {
  if (currentCommand.command === "if") {
    if (key === "arrowdown") {
      const commandElse = getCommandByPlotfieldCommandIfId({
        elseOrEnd: "else",
        plotfieldCommandIfId: focusedCommand,
      });
      if (!commandElse) {
        console.log("wierd, should have command else on arrowDown + shift");
        return;
      }

      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: commandElse._id,
        type: "command",
        commandName: commandElse.command as OmittedCommandNames,
        commandOrder: commandElse.commandOrder,
        isElse: commandElse.isElse,
        parentId: focusedCommand,
      });
      setItem("focusedCommand", commandElse._id);
      setItem("focusedCommandType", "command");
      setItem("focusedCommandParentId", focusedCommand);
      setItem("focusedCommandName", "else");
      setItem("focusedCommandOrder", commandElse.commandOrder);
    } else {
      console.log("you can't do dash up when focused on if, only down");
      return;
    }
  } else if (currentCommand.command === "else") {
    if (key === "arrowup") {
      const commandIf = getCommandOnlyByPlotfieldCommandId({
        plotfieldCommandId: focusedCommandParentId,
      });

      if (!commandIf) {
        console.log("wierd, should have command if on arrowUp + shift");
        return;
      }

      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: commandIf._id,
        type: "command",
        commandName: commandIf.command as OmittedCommandNames,
        commandOrder: commandIf.commandOrder,
        isElse: commandIf.isElse,
      });
      setItem("focusedCommand", commandIf._id);
      setItem("focusedCommandType", "command");
      setItem("focusedCommandName", "if");
      setItem("focusedCommandOrder", commandIf.commandOrder);
    } else if (key === "arrowdown") {
      const commandEnd = getCommandByPlotfieldCommandIfId({
        plotfieldCommandIfId: focusedCommandParentId,
        elseOrEnd: "end",
      });

      if (!commandEnd) {
        console.log("wierd, should have command end on arrowDown + shift");
        return;
      }

      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: commandEnd._id,
        type: "command",
        commandName: commandEnd.command as OmittedCommandNames,
        commandOrder: commandEnd.commandOrder,
        isElse: commandEnd.isElse,
        parentId: focusedCommandParentId,
      });
      setItem("focusedCommand", commandEnd._id);
      setItem("focusedCommandType", "command");
      setItem("focusedCommandName", "end");
      setItem("focusedCommandOrder", commandEnd.commandOrder);
    }
  } else if (currentCommand.command === "end") {
    if (key === "arrowup") {
      const commandElse = getCommandByPlotfieldCommandIfId({
        elseOrEnd: "else",
        plotfieldCommandIfId: focusedCommandParentId,
      });
      if (!commandElse) {
        console.log("wierd, should have command else on arrowUp + shift");
        return;
      }

      setCurrentlyFocusedCommandId({
        currentlyFocusedCommandId: commandElse._id,
        type: "command",
        commandName: commandElse.command as OmittedCommandNames,
        commandOrder: commandElse.commandOrder,
        isElse: commandElse.isElse,
        parentId: focusedCommandParentId,
      });
      setItem("focusedCommand", commandElse._id);
      setItem("focusedCommandType", "command");
      setItem("focusedCommandName", "else");
      setItem("focusedCommandOrder", commandElse.commandOrder);
    } else {
      console.log("you can't do dash up when focused on if, only down");
      return;
    }
  }
}
