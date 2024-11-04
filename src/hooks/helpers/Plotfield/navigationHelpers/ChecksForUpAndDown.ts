import { AllPossiblePlotFieldComamndsTypes } from "../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

type HandleGoingDownToTheFirstCommandTypes = {
  command: AllPossiblePlotFieldComamndsTypes;
  _id: string;
  sayType: CommandSayVariationTypes;
};

export function handleGoingDownToTheFirstCommand({
  _id,
  command,
  sayType,
}: HandleGoingDownToTheFirstCommandTypes) {
  if (command === "if") {
    sessionStorage.setItem("focusedCommand", `if-${_id}-if`);
    // here was a focusedCommandIf, but it was a bad decision to put it here because I need to have this value only when user goes inside if command, the same need to be done for choice and condition(probably)
  } else if (command === "condition") {
    sessionStorage.setItem("focusedCommand", `condition-${_id}-if`);
  } else if (command === "choice") {
    sessionStorage.setItem("focusedCommand", `choice-${_id}`);
  } else {
    sessionStorage.setItem(
      "focusedCommand",
      `${sayType?.trim().length ? sayType : command}-${_id}`
    );

    sessionStorage.setItem("focusedCommandIf", `none`);
    sessionStorage.setItem("focusedCommandCondition", `none`);
    sessionStorage.setItem("focusedCommandChoice", `none`);
  }
}

type NavigateBackAndForthInsideIfCommandTypes = {
  currentCommandId: string | undefined;
  isCommandIf: string;
  key: string;
  currentCommandName: string | undefined;
};

export function navigateBackAndForthInsideIfCommand({
  currentCommandName,
  isCommandIf,
  key,
  currentCommandId,
}: NavigateBackAndForthInsideIfCommandTypes) {
  if (
    currentCommandName === "if" &&
    isCommandIf === "if" &&
    key === "arrowdown"
  ) {
    sessionStorage.setItem("focusedCommand", `if-${currentCommandId}-else`);
    return;
  }

  if (
    currentCommandName === "if" &&
    isCommandIf === "else" &&
    key === "arrowup"
  ) {
    sessionStorage.setItem("focusedCommand", `if-${currentCommandId}-if`);
    return;
  }
}

type NavigateBackAndForthInsideConditionCommandTypes = {
  currentCommandId: string | undefined;
  isCommandIf: string;
  key: string;
  currentCommandName: string | undefined;
};

export function navigateBackAndForthInsideConditionCommand({
  currentCommandName,
  isCommandIf,
  key,
  currentCommandId,
}: NavigateBackAndForthInsideConditionCommandTypes) {
  if (
    currentCommandName === "condition" &&
    isCommandIf === "if" &&
    key === "arrowdown"
  ) {
    sessionStorage.setItem(
      "focusedCommand",
      `condition-${currentCommandId}-else`
    );
    return;
  }

  if (
    currentCommandName === "condition" &&
    isCommandIf === "else" &&
    key === "arrowup"
  ) {
    sessionStorage.setItem(
      "focusedCommand",
      `condition-${currentCommandId}-if`
    );
    return;
  }
}

type HandleNavigationToNextAndPrevCommandTypes = {
  command: AllPossiblePlotFieldComamndsTypes;
  sayType: CommandSayVariationTypes;
  key: string;
  _id: string;
  commandIfId: string;
  topologyBlockId: string;
  topologyBlockIdFromPrevCommand: string;
};

export function handleNavigationToNextAndPrevCommand({
  _id,
  command,
  sayType,
  key,
}: HandleNavigationToNextAndPrevCommandTypes) {
  if (command === "if") {
    sessionStorage.setItem(
      "focusedCommand",
      `if-${_id}-${key === "arrowdown" ? "if" : "else"}`
    );
  } else if (command === "condition") {
    sessionStorage.setItem(
      "focusedCommand",
      `condition-${_id}-${key === "arrowdown" ? "if" : "else"}`
    );
  } else if (command === "choice") {
    sessionStorage.setItem("focusedCommand", `choice-${_id}`);
  } else {
    sessionStorage.setItem(
      "focusedCommand",
      `${sayType?.trim() ? sayType : command}-${_id}`
    );
  }
}
