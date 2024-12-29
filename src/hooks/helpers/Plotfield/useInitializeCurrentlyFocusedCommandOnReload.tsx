import { useEffect } from "react";
import useNavigation, {
  CurrentlyFocusedVariationTypes,
} from "../../../features/Editor/Context/Navigation/NavigationContext";
import { PlotfieldOptimisticCommandTypes } from "../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import usePlotfieldCommands from "../../../features/Editor/PlotField/Context/PlotFieldContext";
import { OmittedCommandNames } from "../../../types/StoryEditor/PlotField/PlotFieldTypes";
import useTypedSessionStorage, { SessionStorageKeys } from "../shared/SessionStorage/useTypedSessionStorage";

export default function useInitializeCurrentlyFocusedCommandOnReload() {
  const { getCommandOnlyByPlotfieldCommandId } = usePlotfieldCommands();
  const currentlyFocusedCommandId = useNavigation((state) => state.currentlyFocusedCommandId);
  const setCurrentlyFocusedCommandId = useNavigation((state) => state.setCurrentlyFocusedCommandId);
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();

  const focusedCommandId = getItem("focusedCommand") || "";
  const focusedCommandType =
    (getItem("focusedCommandType") as CurrentlyFocusedVariationTypes) || ("" as CurrentlyFocusedVariationTypes);
  const focusedCommandParentId = getItem("focusedCommandParentId") || "";

  useEffect(() => {
    if (!currentlyFocusedCommandId._id) {
      if (focusedCommandType === "command") {
        checkIfFocusedAndPlotfieldCommandId({
          getCommandOnlyByPlotfieldCommandId,
          setCurrentlyFocusedCommandId,
          focusedPlotfieldCommandId: focusedCommandId,
          type: "command",
        });
      } else if (focusedCommandType === "choiceOption") {
        checkIfFocusedAndPlotfieldCommandId({
          getCommandOnlyByPlotfieldCommandId,
          setCurrentlyFocusedCommandId,
          focusedPlotfieldCommandId: focusedCommandParentId,
          blockOrOptionId: focusedCommandId,
          type: "choiceOption",
        });
      } else if (focusedCommandType === "conditionBlock") {
        checkIfFocusedAndPlotfieldCommandId({
          getCommandOnlyByPlotfieldCommandId,
          setCurrentlyFocusedCommandId,
          focusedPlotfieldCommandId: focusedCommandParentId,
          blockOrOptionId: focusedCommandId,
          type: "conditionBlock",
        });
      } else {
        console.log("Don't know where you are at");
        return;
      }
    }
  }, [
    currentlyFocusedCommandId._id,
    focusedCommandParentId,
    focusedCommandType,
    getCommandOnlyByPlotfieldCommandId,
    setCurrentlyFocusedCommandId,
    focusedCommandId,
  ]);
}

type CheckIfFocusedAndPlotfieldCommandIdTypes = {
  focusedPlotfieldCommandId: string;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  type: CurrentlyFocusedVariationTypes;
  blockOrOptionId?: string;
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
};

const checkIfFocusedAndPlotfieldCommandId = ({
  focusedPlotfieldCommandId,
  type,
  blockOrOptionId,
  setCurrentlyFocusedCommandId,
  getCommandOnlyByPlotfieldCommandId,
}: CheckIfFocusedAndPlotfieldCommandIdTypes) => {
  if (!focusedPlotfieldCommandId) {
    console.log("No focused command");
    return;
  }

  const currentCommand = getCommandOnlyByPlotfieldCommandId({ plotfieldCommandId: focusedPlotfieldCommandId });

  if (!currentCommand?._id) {
    console.log("what kind of id is that");
    return;
  }

  if (type === "command") {
    setCurrentlyFocusedCommandId({
      commandName: currentCommand.command as OmittedCommandNames,
      commandOrder: currentCommand.commandOrder,
      currentlyFocusedCommandId: currentCommand._id,
      type: type,
      isElse: currentCommand.isElse,
    });
  } else {
    if (!blockOrOptionId) {
      console.log("no parentId, just how");
      return;
    }
    setCurrentlyFocusedCommandId({
      commandName: currentCommand.command as OmittedCommandNames,
      commandOrder: currentCommand.commandOrder,
      currentlyFocusedCommandId: blockOrOptionId || "",
      type: type,
      isElse: currentCommand.isElse,
      parentId: currentCommand._id,
    });
  }
};
