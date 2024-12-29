import {
  CurrentlyFocusedCommandTypes,
  CurrentlyFocusedVariationTypes,
} from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { ConditionBlockItemTypes } from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";
import { OmittedCommandNames } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";

type MovingAmongConditionBlocksTypes = {
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
  getAmountOfConditionBlocks: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => number;
  getAllConditionBlocksByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes[];
  getCurrentlyOpenConditionBlock: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ConditionBlockItemTypes | null;
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
  currentlyFocusedCommandId: CurrentlyFocusedCommandTypes;
  key: string;
};

export default function movingAmongConditionBlocks({
  currentlyFocusedCommandId,
  key,
  getAllConditionBlocksByPlotfieldCommandId,
  getAmountOfConditionBlocks,
  getConditionBlockByIndex,
  getCurrentlyOpenConditionBlock,
  setCurrentlyFocusedCommandId,
  setItem,
  updateCurrentlyOpenConditionBlock,
}: MovingAmongConditionBlocksTypes) {
  if (currentlyFocusedCommandId.type === "conditionBlock") {
    const amountOfBlock = getAmountOfConditionBlocks({
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });
    const currentBlock = getCurrentlyOpenConditionBlock({
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });
    const currentIndex = getAllConditionBlocksByPlotfieldCommandId({
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    }).findIndex((p) => p.conditionBlockId === currentBlock?.conditionBlockId);

    if (currentIndex < 0) {
      console.log("Index of conditionBlock can not be less than 0");
      return;
    }

    if (amountOfBlock <= 1) {
      console.log("there should be at least 2 blocks to move between them");
      return;
    }

    const index =
      key === "arrowdown"
        ? currentIndex === amountOfBlock - 1
          ? 0
          : currentIndex + 1
        : currentIndex === 0
        ? amountOfBlock - 1
        : currentIndex - 1;

    const newCurrentBlock = getConditionBlockByIndex({
      index,
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });

    if (!newCurrentBlock) {
      console.log("Weird, no newCurrentBlock with this index");
      return;
    }

    if (!newCurrentBlock.targetBlockId) {
      console.log("ConditionBlock should have a topologyBlockId in order to jump on it");
      return;
    }

    updateCurrentlyOpenConditionBlock({
      conditionBlockId: newCurrentBlock.conditionBlockId,
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });

    setCurrentlyFocusedCommandId({
      commandName: "condition",
      commandOrder: currentlyFocusedCommandId.commandOrder || 0,
      currentlyFocusedCommandId: newCurrentBlock.conditionBlockId,
      type: "conditionBlock",
      isElse: newCurrentBlock.isElse,
      parentId: currentlyFocusedCommandId.parentId,
    });

    setItem("focusedCommand", newCurrentBlock.conditionBlockId);
    setItem("focusedTopologyBlock", newCurrentBlock.targetBlockId);
    setItem("focusedConditionIsElse", newCurrentBlock.isElse);
  }
}
