import { CurrentlyFocusedVariationTypes } from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type NavigateBackAndForthInsideIfCommandTypes = {
  currentCommandId: string | undefined;
  isCommandIf: string;
  key: string;
  currentCommandName: string | undefined;
  setCurrentlyFocusedCommandId: ({
    currentlyFocusedCommandId,
    isElse,
    type,
  }: {
    currentlyFocusedCommandId: string;
    isElse?: boolean;
    type: CurrentlyFocusedVariationTypes;
  }) => void;
};

export function navigateBackAndForthInsideIfCommand({
  currentCommandName,
  isCommandIf,
  key,
  currentCommandId,
  setCurrentlyFocusedCommandId,
}: NavigateBackAndForthInsideIfCommandTypes) {
  if (currentCommandName === "if" && isCommandIf === "if" && key === "arrowdown") {
    setCurrentlyFocusedCommandId({ currentlyFocusedCommandId: currentCommandId || "", isElse: true, type: "command" });
    return;
  }

  if (currentCommandName === "if" && isCommandIf === "else" && key === "arrowup") {
    setCurrentlyFocusedCommandId({ currentlyFocusedCommandId: currentCommandId || "", isElse: false, type: "command" });
    return;
  }
}

type NavigateBackAndForthInsideConditionCommandTypes = {
  currentCommandId: string | undefined;
  isCommandIf: string;
  key: string;
  currentCommandName: string | undefined;
  setCurrentlyFocusedCommandId: ({
    currentlyFocusedCommandId,
    isElse,
    type,
  }: {
    currentlyFocusedCommandId: string;
    isElse?: boolean;
    type: CurrentlyFocusedVariationTypes;
  }) => void;
};

export function navigateBackAndForthInsideConditionCommand({
  currentCommandName,
  isCommandIf,
  key,
  currentCommandId,
  setCurrentlyFocusedCommandId,
}: NavigateBackAndForthInsideConditionCommandTypes) {
  if (currentCommandName === "condition" && isCommandIf === "if" && key === "arrowdown") {
    sessionStorage.setItem("focusedCommand", `condition-${currentCommandId}-else`);
    setCurrentlyFocusedCommandId({ currentlyFocusedCommandId: currentCommandId || "", isElse: true, type: "command" });
    return;
  }

  if (currentCommandName === "condition" && isCommandIf === "else" && key === "arrowup") {
    sessionStorage.setItem("focusedCommand", `condition-${currentCommandId}-if`);
    setCurrentlyFocusedCommandId({ currentlyFocusedCommandId: currentCommandId || "", isElse: false, type: "command" });
    return;
  }
}

type HandleNavigationToNextAndPrevCommandTypes = {
  command: AllPossiblePlotFieldComamndsTypes;
  sayType: CommandSayVariationTypes;
  key: string;
  _id: string;
  topologyBlockId: string;
  topologyBlockIdFromPrevCommand: string;
  setCurrentlyFocusedCommandId: ({
    currentlyFocusedCommandId,
    isElse,
    type,
  }: {
    currentlyFocusedCommandId: string;
    isElse?: boolean;
    type: CurrentlyFocusedVariationTypes;
  }) => void;
};

export function handleNavigationToNextAndPrevCommand({
  _id,
  command,
  key,
  setCurrentlyFocusedCommandId,
}: HandleNavigationToNextAndPrevCommandTypes) {
  if (command === "if") {
    setCurrentlyFocusedCommandId({
      currentlyFocusedCommandId: _id || "",
      isElse: key === "arrowdown" ? false : true,
      type: "command",
    });
  } else if (command === "condition") {
    setCurrentlyFocusedCommandId({
      currentlyFocusedCommandId: _id || "",
      isElse: key === "arrowdown" ? false : true,
      type: "command",
    });
  } else if (command === "choice") {
    setCurrentlyFocusedCommandId({ currentlyFocusedCommandId: _id || "", type: "command" });
  } else {
    setCurrentlyFocusedCommandId({ currentlyFocusedCommandId: _id || "", type: "command" });
  }
}
