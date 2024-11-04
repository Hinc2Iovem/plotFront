import { ConditionBlockItemTypes } from "../../../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type NavigateBetweenBlocksTypes = {
  currentFocusedCommandConditionPlotfieldId: string;
  getConditionBlockByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => ConditionBlockItemTypes | null;
  updateCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => void;
  currentIndex: number;
  deepLevelConditionBlocks: number;
  isArrowDown: boolean;
};

export function navigateBetweenBlocks({
  currentFocusedCommandConditionPlotfieldId,
  deepLevelConditionBlocks,
  currentIndex,
  isArrowDown,
  getConditionBlockByIndex,
  updateCurrentlyOpenConditionBlock,
}: NavigateBetweenBlocksTypes) {
  const newConditionBlock = getConditionBlockByIndex({
    plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
    index: isArrowDown ? currentIndex - 1 : currentIndex + 1,
  });

  console.log("newConditionBlock: ", newConditionBlock);

  if (!newConditionBlock) {
    console.log("Oops, this one shouldn't have happened");
    return;
  }

  const newConditionBlockValue = `${
    newConditionBlock.isElse ? "else" : newConditionBlock.conditionType
  }-${
    newConditionBlock.conditionBlockId
  }-plotfieldCommandId-${currentFocusedCommandConditionPlotfieldId}?`;

  if (deepLevelConditionBlocks === 0) {
    sessionStorage.setItem(
      "focusedConditionBlock",
      `${newConditionBlockValue}`
    );
  } else {
    const prevValue = sessionStorage
      .getItem("focusedConditionBlock")
      ?.split("?")
      .filter(Boolean);
    const prevValueWithoutPrevBlock = prevValue?.slice(0, -1);

    sessionStorage.setItem(
      "focusedConditionBlock",
      `${prevValueWithoutPrevBlock?.join("?")}${newConditionBlockValue}`
    );
  }

  sessionStorage.setItem(
    "focusedTopologyBlock",
    newConditionBlock.targetBlockId
  );
  updateCurrentlyOpenConditionBlock({
    conditionBlockId: newConditionBlock.conditionBlockId,
    plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
  });
}
