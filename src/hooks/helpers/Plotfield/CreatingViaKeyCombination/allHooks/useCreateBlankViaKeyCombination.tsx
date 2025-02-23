import useNavigation, { CurrentlyFocusedCommandTypes } from "@/features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "@/features/Editor/PlotField/Context/PlotFieldContext";
import useCreateBlankCommand from "@/features/Editor/PlotField/hooks/useCreateBlankCommand";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "@/hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import { addItemInUndoSessionStorage } from "@/hooks/helpers/UndoRedo/addItemInUndoSessionStorage";
import { AllPossiblePlotFieldComamndsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { preventCreatingCommandsWhenFocus } from "../../preventCreatingCommandsWhenFocus";

type CreateBlankViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateBlankViaKeyCombination({ topologyBlockId }: CreateBlankViaKeyCombinationTypes) {
  const { episodeId } = useParams();
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();
  const { currentlyFocusedCommandId } = useNavigation();
  const createPlotfield = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  const shortcutTriggered = useRef(false);
  const pressedKeys = useRef(new Set());

  const handleCreateBlankCommand = useCallback(() => {
    const _id = generateMongoObjectId();
    const focusedTopologyBlockId = getItem("focusedTopologyBlock");
    const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

    addItemInUndoSessionStorage({
      _id,
      episodeId: episodeId || "",
      topologyBlockId: currentTopologyBlockId,
      type: "created",
    });

    const plotfieldCommandIfId = getPlotfieldCommandIfId(currentlyFocusedCommandId);
    const getNextCommandOrder = (currentCommand: CurrentlyFocusedCommandTypes, currentTopologyBlockId: string) => {
      return typeof currentCommand.commandOrder === "number"
        ? currentCommand.commandOrder + 1
        : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId });
    };

    createPlotfield.mutate({
      _id,
      topologyBlockId: currentTopologyBlockId,
      isElse: currentlyFocusedCommandId?.isElse,
      plotfieldCommandIfId,
      commandOrder: getNextCommandOrder(currentlyFocusedCommandId, currentTopologyBlockId),
    });

    pressedKeys.current.clear();
  }, [createPlotfield, currentlyFocusedCommandId, episodeId, getCurrentAmountOfCommands, getItem, topologyBlockId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!preventCreatingCommandsWhenFocus()) {
        console.log("Not allowed to move on focus");
        return;
      }

      const key = event.key.toLowerCase();

      if (event.repeat) return;
      pressedKeys.current.add(key);
      if (
        pressedKeys.current.has("shift") &&
        (pressedKeys.current.has("n") || pressedKeys.current.has("т")) &&
        pressedKeys.current.size === 2 &&
        !shortcutTriggered.current
      ) {
        shortcutTriggered.current = true;

        handleCreateBlankCommand();
      }
    };

    const handleKeyUp = () => {
      pressedKeys.current.clear();
      if (pressedKeys.current.size === 0) {
        shortcutTriggered.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleCreateBlankCommand]);

  function getPlotfieldCommandIfId(currentCommand: CurrentlyFocusedCommandTypes) {
    return currentCommand.commandName === "if" ||
      (currentCommand.commandName as AllPossiblePlotFieldComamndsTypes) === "else" ||
      (typeof currentCommand.isElse === "boolean" && currentCommand.parentId)
      ? currentCommand?.parentId
      : "";
  }
}
