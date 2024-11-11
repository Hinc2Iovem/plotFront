import { ConditionBlockItemTypes } from "../../../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type FromLastToFirstBlockTypes = {
  currentFocusedCommandConditionPlotfieldId: string;
  getConditionBlockByIndex: ({
    plotfieldCommandId,
    index,
  }: {
    plotfieldCommandId: string;
    index: number;
  }) => ConditionBlockItemTypes | null;
  currentFocusedConditionBlockId: string;
  updateCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
    conditionBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
  }) => void;
  deepLevelConditionBlocks: number;
  currentFocusedCommandConditionId: string;
};

export function fromLastToFirstBlock({
  currentFocusedCommandConditionPlotfieldId,
  currentFocusedConditionBlockId,
  deepLevelConditionBlocks,
  currentFocusedCommandConditionId,
  getConditionBlockByIndex,
  updateCurrentlyOpenConditionBlock,
}: FromLastToFirstBlockTypes) {
  const newConditionBlock = getConditionBlockByIndex({
    plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
    index: 0,
  });

  if (!newConditionBlock) {
    console.log("Oops, this one shouldn't have happened");
    return;
  }

  if (currentFocusedConditionBlockId === newConditionBlock.conditionBlockId) {
    console.log("You have only 1 block");
    return;
  }

  const currentFocusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");
  const currentFocusedCommandPlotfieldId = (currentFocusedCommand || [])[1];

  sessionStorage.setItem("focusedCommand", `condition-${currentFocusedCommandPlotfieldId}-else`);

  sessionStorage.setItem(
    "focusedCommandCondition",
    `else-${currentFocusedCommandConditionPlotfieldId}-conditionId-${currentFocusedCommandConditionId}`
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
