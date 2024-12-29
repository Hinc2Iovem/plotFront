import {
  CurrentlyFocusedCommandTypes,
  CurrentlyFocusedVariationTypes,
} from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { PlotfieldOptimisticCommandTypes } from "../../../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import { ConditionBlockItemTypes } from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";
import { OmittedCommandNames } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";
import getCurrentPlotfieldCommandIdInsideTypes from "./sessionStorage/FocusedCommandInsideType/getCurrentPlotfieldCommandIdInsideType";
import getPrevPlotfieldCommandIdInsideTypes from "./sessionStorage/FocusedCommandInsideType/getPrevPlotfieldCommandIdInsideType";
import setFocusedCommandInsideType from "./sessionStorage/FocusedCommandInsideType/setFocusedCommandInsideType";

type InsideAndOutsideConditionBlockTypes = {
  getItem: <K extends keyof SessionStorageKeys>(key: K) => SessionStorageKeys[K] | null;
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
  currentCommand: PlotfieldOptimisticCommandTypes;
  currentlyFocusedCommandId: CurrentlyFocusedCommandTypes;
  key: string;
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
  getCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes | null;
  getCommandsByTopologyBlockId: ({ topologyBlockId }: { topologyBlockId: string }) => PlotfieldOptimisticCommandTypes[];
  getFirstConditionBlockWithTopologyBlockId: ({
    plotfieldCommandId,
    insideElse,
  }: {
    plotfieldCommandId: string;
    insideElse: boolean;
  }) => ConditionBlockItemTypes | null;
  updateCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => void;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
};

export default function insideAndOutsideConditionBlock({
  currentCommand,
  key,
  currentlyFocusedCommandId,
  setCurrentlyFocusedCommandId,
  getCommandsByTopologyBlockId,
  getCurrentlyOpenConditionBlock,
  getFirstConditionBlockWithTopologyBlockId,
  updateCurrentlyOpenConditionBlock,
  getCommandOnlyByPlotfieldCommandId,
  getItem,
  setItem,
}: InsideAndOutsideConditionBlockTypes) {
  if (currentCommand.command === "condition") {
    const isElse = getItem("focusedConditionIsElse") || false;
    const focusedCommand = getItem("focusedCommand") || "";

    if (key === "arrowdown") {
      if (currentlyFocusedCommandId.type === "conditionBlock") {
        // when focused on some conditionBlock and jumping straight to first command
        const parentId = getItem("focusedCommandParentId") || "";
        const blockTopologyBlockId = getItem("focusedTopologyBlock") || "";
        const firstCommand = getCommandsByTopologyBlockId({
          topologyBlockId: blockTopologyBlockId,
        })[0];

        if (!firstCommand) {
          console.log("No command inside this block was found");
          return;
        }

        setCurrentlyFocusedCommandId({
          commandName: firstCommand.command as OmittedCommandNames,
          commandOrder: firstCommand?.commandOrder || 0,
          currentlyFocusedCommandId: firstCommand._id || "",
          type: "command",
          isElse: isElse,
          parentId: parentId,
        });

        setItem("focusedCommand", firstCommand._id);
        setItem("focusedCommandOrder", firstCommand.commandOrder);
        setItem("focusedCommandName", firstCommand.command);
        setItem("focusedCommandType", "command");
        return;
      }

      // when jumping inside some conditionBlock
      const block = getFirstConditionBlockWithTopologyBlockId({
        insideElse: isElse,
        plotfieldCommandId: focusedCommand,
      });

      updateCurrentlyOpenConditionBlock({
        conditionBlockId: block?.conditionBlockId || "",
        plotfieldCommandId: focusedCommand,
      });

      setCurrentlyFocusedCommandId({
        commandName: "condition",
        commandOrder: currentlyFocusedCommandId.commandOrder || 0,
        currentlyFocusedCommandId: block?.conditionBlockId || "",
        parentId: focusedCommand,
        type: "conditionBlock",
        isElse: isElse,
      });

      setItem("focusedCommandParentId", focusedCommand);
      setItem("focusedTopologyBlock", block?.targetBlockId || "");
      setItem("focusedCommandType", "conditionBlock");
      setItem("focusedCommand", block?.conditionBlockId || "");
      setFocusedCommandInsideType({
        getItem,
        newType: "condition",
        parentId: focusedCommand || "",
        setItem,
      });
    } else if (key === "arrowup") {
      if (currentlyFocusedCommandId.type === "conditionBlock") {
        // when focused on some conditionBlock
        const parentId = getItem("focusedCommandParentId") || "";
        const currentCommandCondition = getCommandOnlyByPlotfieldCommandId({
          plotfieldCommandId: parentId,
        });

        setCurrentlyFocusedCommandId({
          commandName: "condition",
          commandOrder: currentCommandCondition?.commandOrder || 0,
          currentlyFocusedCommandId: parentId || "",
          type: "command",
          isElse: isElse,
        });

        const prevParentId = getPrevPlotfieldCommandIdInsideTypes({ getItem, setItem }); //removes last element of focusedCommandInsideType(sessionStorage)
        setItem("focusedTopologyBlock", currentCommand?.topologyBlockId || "");
        setItem("focusedCommandParentId", prevParentId || "");
        setItem("focusedCommandType", "command");
        setItem("focusedCommand", parentId);
        setItem("focusedCommandName", "condition");
        setItem("focusedCommandOrder", currentCommandCondition?.commandOrder || 0);
        return;
      } else {
        // when focused on some command inside ConditionBlock and going up to ConditionBlock
        const currentConditionPlotfieldCommandId = getCurrentPlotfieldCommandIdInsideTypes({ getItem });
        const block = getCurrentlyOpenConditionBlock({ plotfieldCommandId: currentConditionPlotfieldCommandId });
        const currentCommandCondition = getCommandOnlyByPlotfieldCommandId({
          plotfieldCommandId: currentConditionPlotfieldCommandId,
        });

        if (!block) {
          console.log("Should have a condition plotfieldCommandId");
          return;
        }

        setCurrentlyFocusedCommandId({
          commandName: "condition",
          commandOrder: currentCommandCondition?.commandOrder || 0,
          currentlyFocusedCommandId: block.conditionBlockId || "",
          type: "conditionBlock",
          isElse: isElse,
          parentId: currentConditionPlotfieldCommandId,
        });

        setItem("focusedCommandType", "conditionBlock");
        setItem("focusedCommand", block.conditionBlockId);
        setItem("focusedCommandName", "condition");
        setItem("focusedCommandOrder", currentCommandCondition?.commandOrder || 0);
      }
    }
  }
}
