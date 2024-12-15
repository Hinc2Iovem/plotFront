import { PlotfieldOptimisticCommandTypes } from "../../../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import { ConditionBlockItemTypes } from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";

type GoingDownInsideConditionTypes = {
  plotfieldCommandId: string | undefined;
  isGoingDown: boolean;
  insideIf: boolean;
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
    targetBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
    targetBlockId: string;
  }) => void;
};

export function GoingDownInsideCondition({
  isGoingDown,
  insideIf,
  getFirstConditionBlockWithTopologyBlockId,
  plotfieldCommandId,
  updateCurrentlyOpenConditionBlock,
}: GoingDownInsideConditionTypes) {
  if (isGoingDown) {
    const firstConditionBlockWithTargetBlock = getFirstConditionBlockWithTopologyBlockId({
      plotfieldCommandId: plotfieldCommandId || "",
      insideElse: insideIf,
    });

    if (!firstConditionBlockWithTargetBlock?.targetBlockId) {
      console.log("Choose topology block first");
      return;
    }
    updateCurrentlyOpenConditionBlock({
      conditionBlockId: firstConditionBlockWithTargetBlock.conditionBlockId,
      plotfieldCommandId: plotfieldCommandId || "",
      targetBlockId: firstConditionBlockWithTargetBlock.targetBlockId,
    });

    sessionStorage.setItem("focusedTopologyBlock", `${firstConditionBlockWithTargetBlock.targetBlockId}`);
  }
}

type GoingUpFromConditionTypes = {
  plotfieldCommandId: string | undefined;
  isGoingUp: boolean;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes | null;
  updateCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
    conditionBlockId,
    targetBlockId,
  }: {
    plotfieldCommandId: string;
    conditionBlockId: string;
    targetBlockId: string;
  }) => void;
};

export function GoingUpFromCondition({
  getCommandOnlyByPlotfieldCommandId,
  getCurrentlyOpenConditionBlock,
  isGoingUp,
  plotfieldCommandId,
  updateCurrentlyOpenConditionBlock,
}: GoingUpFromConditionTypes) {
  if (isGoingUp) {
    const currentCondition = sessionStorage.getItem("focusedCommandCondition");
    const isInsideIf = currentCondition?.split("-")[0] === "if";
    const currentlyOpenConditionBlock = getCurrentlyOpenConditionBlock({
      plotfieldCommandId: plotfieldCommandId || "",
    });

    const currentPlotfieldCommand = getCommandOnlyByPlotfieldCommandId({
      plotfieldCommandId: plotfieldCommandId || "",
    });

    if (!currentlyOpenConditionBlock) {
      console.log("You are not inside any of conditionBlocks");
      return;
    }
    updateCurrentlyOpenConditionBlock({
      conditionBlockId: currentlyOpenConditionBlock.conditionBlockId,
      plotfieldCommandId: plotfieldCommandId || "",
      targetBlockId: "",
    });

    sessionStorage.setItem("focusedTopologyBlock", `${currentPlotfieldCommand?.topologyBlockId}`);
    sessionStorage.setItem("focusedCommand", `condition-${plotfieldCommandId}-${isInsideIf ? "if" : "else"}`);
  }
}
