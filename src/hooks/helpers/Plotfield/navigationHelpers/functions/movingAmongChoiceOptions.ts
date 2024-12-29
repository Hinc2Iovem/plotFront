import {
  CurrentlyFocusedCommandTypes,
  CurrentlyFocusedVariationTypes,
} from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { ChoiceOptionItemTypes } from "../../../../../features/Editor/PlotField/PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import { OmittedCommandNames } from "../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";

type MovingAmongChoiceOptionsTypes = {
  setItem: <K extends keyof SessionStorageKeys>(key: K, value: SessionStorageKeys[K]) => void;
  getAmountOfChoiceOptions: ({ plotfieldCommandId }: { plotfieldCommandId: string }) => number;
  getAllChoiceOptionsByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes[];
  getCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes | null;
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

export default function movingAmongChoiceOptions({
  currentlyFocusedCommandId,
  key,
  getAllChoiceOptionsByPlotfieldCommandId,
  getAmountOfChoiceOptions,
  getChoiceOptionByIndex,
  getCurrentlyOpenChoiceOption,
  setCurrentlyFocusedCommandId,
  setItem,
  updateCurrentlyOpenChoiceOption,
}: MovingAmongChoiceOptionsTypes) {
  if (currentlyFocusedCommandId.type === "choiceOption") {
    const amountOfBlock = getAmountOfChoiceOptions({
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });
    const currentBlock = getCurrentlyOpenChoiceOption({
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });
    const currentIndex = getAllChoiceOptionsByPlotfieldCommandId({
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    }).findIndex((p) => p.choiceOptionId === currentBlock?.choiceOptionId);

    if (currentIndex < 0) {
      console.log("Index of choiceOption can not be less than 0");
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

    const newCurrentBlock = getChoiceOptionByIndex({
      index,
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });

    if (!newCurrentBlock) {
      console.log("Weird, no newCurrentBlock with this index");
      return;
    }

    if (!newCurrentBlock.topologyBlockId) {
      console.log("ChoiceOption should have a topologyBlockId in order to jump on it");
      return;
    }

    updateCurrentlyOpenChoiceOption({
      choiceOptionId: newCurrentBlock.choiceOptionId,
      plotfieldCommandId: currentlyFocusedCommandId.parentId || "",
    });

    setCurrentlyFocusedCommandId({
      commandName: "choice",
      commandOrder: currentlyFocusedCommandId.commandOrder || 0,
      currentlyFocusedCommandId: newCurrentBlock.choiceOptionId,
      type: "choiceOption",
      parentId: currentlyFocusedCommandId.parentId,
    });

    setItem("focusedCommand", newCurrentBlock.choiceOptionId);
    setItem("focusedTopologyBlock", newCurrentBlock.topologyBlockId);
  }
}
