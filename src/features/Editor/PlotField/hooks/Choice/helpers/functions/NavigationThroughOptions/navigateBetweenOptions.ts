import { ChoiceOptionItemTypes } from "../../../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";

type NavigateBetweenOptionsTypes = {
  currentFocusedCommandChoicePlotfieldId: string;
  getChoiceOptionByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => ChoiceOptionItemTypes | null;
  updateCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
  }) => void;
  currentIndex: number;
  deepLevelChoiceOptions: number;
  isArrowDown: boolean;
};

export function navigateBetweenOptions({
  currentFocusedCommandChoicePlotfieldId,
  deepLevelChoiceOptions,
  currentIndex,
  isArrowDown,
  getChoiceOptionByIndex,
  updateCurrentlyOpenChoiceOption,
}: NavigateBetweenOptionsTypes) {
  const newChoiceOption = getChoiceOptionByIndex({
    plotfieldCommandId: currentFocusedCommandChoicePlotfieldId,
    index: isArrowDown ? currentIndex - 1 : currentIndex + 1,
  });

  console.log("newChoiceOption: ", newChoiceOption);

  if (!newChoiceOption) {
    console.log("Oops, this one shouldn't have happened");
    return;
  }

  const newChoiceOptionValue = `${newChoiceOption.optionType}-${newChoiceOption.choiceOptionId}-plotfieldCommandId-${currentFocusedCommandChoicePlotfieldId}?`;

  if (deepLevelChoiceOptions === 0) {
    sessionStorage.setItem("focusedChoiceOption", `${newChoiceOptionValue}`);
  } else {
    const prevValue = sessionStorage.getItem("focusedChoiceOption")?.split("?").filter(Boolean);
    const prevValueWithoutPrevOption = prevValue?.slice(0, -1);

    sessionStorage.setItem("focusedChoiceOption", `${prevValueWithoutPrevOption?.join("?")}?${newChoiceOptionValue}`);
  }

  sessionStorage.setItem("focusedTopologyBlock", newChoiceOption.topologyBlockId);
  updateCurrentlyOpenChoiceOption({
    choiceOptionId: newChoiceOption.choiceOptionId,
    plotfieldCommandId: currentFocusedCommandChoicePlotfieldId,
  });
}
