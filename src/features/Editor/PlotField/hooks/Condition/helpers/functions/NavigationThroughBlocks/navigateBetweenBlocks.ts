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
  currentFocusedCommandConditionId: string;
};

export function navigateBetweenBlocks({
  currentFocusedCommandConditionPlotfieldId,
  deepLevelConditionBlocks,
  currentIndex,
  isArrowDown,
  currentFocusedCommandConditionId,
  getConditionBlockByIndex,
  updateCurrentlyOpenConditionBlock,
}: NavigateBetweenBlocksTypes) {
  const newConditionBlock = getConditionBlockByIndex({
    plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
    index: isArrowDown ? currentIndex - 1 : currentIndex + 1,
  });

  if (!newConditionBlock) {
    console.log("Oops, this one shouldn't have happened");
    return;
  }

  const currentFocusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

  const currentFocusedCommandPlotfieldId = (currentFocusedCommand || [])[1];

  sessionStorage.setItem(
    "focusedCommand",
    `condition-${currentFocusedCommandPlotfieldId}-${isArrowDown && currentIndex - 1 === 0 ? "else" : "if"}`
  );

  sessionStorage.setItem(
    "focusedCommandCondition",
    `${
      isArrowDown && currentIndex - 1 === 0 ? "else" : "if"
    }-${currentFocusedCommandConditionPlotfieldId}-conditionId-${currentFocusedCommandConditionId}`
  );

  const newConditionBlockValue = `${newConditionBlock.isElse ? "else" : "if"}-${
    newConditionBlock.conditionBlockId
  }-plotfieldCommandId-${currentFocusedCommandConditionPlotfieldId}?`;

  if (deepLevelConditionBlocks === 0) {
    sessionStorage.setItem("focusedConditionBlock", `${newConditionBlockValue}`);
  } else {
    const prevValue = sessionStorage.getItem("focusedConditionBlock")?.split("?").filter(Boolean);
    const prevValueWithoutPrevBlock = prevValue?.slice(0, -1);

    sessionStorage.setItem(
      "focusedConditionBlock",
      `${prevValueWithoutPrevBlock?.join("?")}?${newConditionBlockValue}`
    );
  }

  sessionStorage.setItem("focusedTopologyBlock", newConditionBlock.targetBlockId);
  updateCurrentlyOpenConditionBlock({
    conditionBlockId: newConditionBlock.conditionBlockId,
    plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
  });
}
