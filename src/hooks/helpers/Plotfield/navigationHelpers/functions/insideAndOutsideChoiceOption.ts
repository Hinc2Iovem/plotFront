import {
  CurrentlyFocusedCommandTypes,
  CurrentlyFocusedVariationTypes,
} from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { PlotfieldOptimisticCommandTypes } from "../../../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import { ChoiceOptionItemTypes } from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import { OmittedCommandNames } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";
import getCurrentPlotfieldCommandIdInsideTypes from "./sessionStorage/FocusedCommandInsideType/getCurrentPlotfieldCommandIdInsideType";
import getPrevPlotfieldCommandIdInsideTypes from "./sessionStorage/FocusedCommandInsideType/getPrevPlotfieldCommandIdInsideType";
import setFocusedCommandInsideType from "./sessionStorage/FocusedCommandInsideType/setFocusedCommandInsideType";

type InsideAndOutsideChoiceOptionTypes = {
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
  getCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes | null;
  getFirstChoiceOptionWithTopologyBlockId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes | null;
  getCommandsByTopologyBlockId: ({ topologyBlockId }: { topologyBlockId: string }) => PlotfieldOptimisticCommandTypes[];
  updateCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
  }) => void;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
};

export default function insideAndOutsideChoiceOption({
  currentCommand,
  key,
  currentlyFocusedCommandId,
  setCurrentlyFocusedCommandId,
  getCommandsByTopologyBlockId,
  getFirstChoiceOptionWithTopologyBlockId,
  updateCurrentlyOpenChoiceOption,
  getCommandOnlyByPlotfieldCommandId,
  getCurrentlyOpenChoiceOption,
  getItem,
  setItem,
}: InsideAndOutsideChoiceOptionTypes) {
  if (currentCommand.command === "choice") {
    const focusedCommand = getItem("focusedCommand") || "";

    if (key === "arrowdown") {
      if (currentlyFocusedCommandId.type === "choiceOption") {
        // when focused on some choiceOption and jumping straight to first command
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
          parentId: parentId,
        });

        setItem("focusedCommand", firstCommand._id);
        setItem("focusedCommandOrder", firstCommand.commandOrder);
        setItem("focusedCommandName", firstCommand.command);
        setItem("focusedCommandType", "command");
        return;
      }

      // when jumping inside some choiceOption
      const option = getFirstChoiceOptionWithTopologyBlockId({
        plotfieldCommandId: focusedCommand,
      });

      updateCurrentlyOpenChoiceOption({
        choiceOptionId: option?.choiceOptionId || "",
        plotfieldCommandId: focusedCommand,
      });

      setCurrentlyFocusedCommandId({
        commandName: "choice",
        commandOrder: currentlyFocusedCommandId.commandOrder || 0,
        currentlyFocusedCommandId: option?.choiceOptionId || "",
        parentId: focusedCommand,
        type: "choiceOption",
      });

      setItem("focusedCommandParentId", focusedCommand);
      setItem("focusedTopologyBlock", option?.topologyBlockId || "");
      setItem("focusedCommandType", "choiceOption");
      setItem("focusedCommand", option?.choiceOptionId || "");
      setFocusedCommandInsideType({
        getItem,
        newType: "choice",
        parentId: focusedCommand || "",
        setItem,
      });
    } else if (key === "arrowup") {
      if (currentlyFocusedCommandId.type === "choiceOption") {
        // when focused on some choiceOption
        const parentId = getItem("focusedCommandParentId") || "";
        const currentCommandChoice = getCommandOnlyByPlotfieldCommandId({
          plotfieldCommandId: parentId,
        });
        setCurrentlyFocusedCommandId({
          commandName: "choice",
          commandOrder: currentCommandChoice?.commandOrder || 0,
          currentlyFocusedCommandId: parentId,
          type: "command",
        });

        const prevParentId = getPrevPlotfieldCommandIdInsideTypes({ getItem, setItem }); //removes last element of focusedCommandInsideType(sessionStorage)
        setItem("focusedCommandParentId", prevParentId || "");
        setItem("focusedTopologyBlock", currentCommand?.topologyBlockId || "");
        setItem("focusedCommandType", "command");
        setItem("focusedCommand", parentId);
        setItem("focusedCommandName", "choice");
        setItem("focusedCommandOrder", currentCommandChoice?.commandOrder || 0);
        return;
      } else {
        // when focused on some command inside ChoiceOption and going up to ChoiceOption
        const currentChoicePlotfieldCommandId = getCurrentPlotfieldCommandIdInsideTypes({ getItem });
        const block = getCurrentlyOpenChoiceOption({ plotfieldCommandId: currentChoicePlotfieldCommandId });
        const currentCommandChoice = getCommandOnlyByPlotfieldCommandId({
          plotfieldCommandId: currentChoicePlotfieldCommandId,
        });

        if (!block) {
          console.log("Should have a choice plotfieldCommandId");
          return;
        }

        setCurrentlyFocusedCommandId({
          commandName: "choice",
          commandOrder: currentCommandChoice?.commandOrder || 0,
          currentlyFocusedCommandId: block.choiceOptionId || "",
          type: "choiceOption",
          parentId: currentChoicePlotfieldCommandId,
        });
        setItem("focusedCommandType", "choiceOption");
        setItem("focusedCommand", block.choiceOptionId);
        setItem("focusedCommandName", "choice");
        setItem("focusedCommandOrder", currentCommandChoice?.commandOrder || 0);
      }
    }
  }
}
