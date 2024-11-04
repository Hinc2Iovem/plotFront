import { ChoiceOptionItemTypes } from "../../../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";

type FromFirstToLastOptionTypes = {
  currentAmountOfOptions: number;
  currentFocusedCommandChoicePlotfieldId: string;
  getChoiceOptionByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => ChoiceOptionItemTypes | null;
  currentFocusedChoiceOptionId: string;
  updateCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
  }) => void;
  deepLevelChoiceOptions: number;
};

export function fromFirstToLastOption({
  currentAmountOfOptions,
  currentFocusedCommandChoicePlotfieldId,
  currentFocusedChoiceOptionId,
  deepLevelChoiceOptions,
  getChoiceOptionByIndex,
  updateCurrentlyOpenChoiceOption,
}: FromFirstToLastOptionTypes) {
  const newChoiceOption = getChoiceOptionByIndex({
    plotfieldCommandId: currentFocusedCommandChoicePlotfieldId,
    index: currentAmountOfOptions - 1,
  });

  if (!newChoiceOption) {
    console.log("Oops, this one shouldn't have happened");
    return;
  }

  if (currentFocusedChoiceOptionId === newChoiceOption.choiceOptionId) {
    console.log("You have only 1 option");
    return;
  }

  const newChoiceOptionValue = `${newChoiceOption.optionType}-${newChoiceOption.choiceOptionId}-plotfieldCommandId-${currentFocusedCommandChoicePlotfieldId}?`;

  if (deepLevelChoiceOptions === 0) {
    sessionStorage.setItem("focusedChoiceOption", `${newChoiceOptionValue}`);
  } else {
    const prevValue = sessionStorage
      .getItem("focusedChoiceOption")
      ?.split("?")
      .filter(Boolean);
    const prevValueWithoutPrevOption = prevValue?.slice(0, -1);

    sessionStorage.setItem(
      "focusedChoiceOption",
      `${prevValueWithoutPrevOption?.join("?")}${newChoiceOptionValue}`
    );
  }

  sessionStorage.setItem(
    "focusedTopologyBlock",
    newChoiceOption.topologyBlockId
  );
  updateCurrentlyOpenChoiceOption({
    choiceOptionId: newChoiceOption.choiceOptionId,
    plotfieldCommandId: currentFocusedCommandChoicePlotfieldId,
  });
  return;
}
