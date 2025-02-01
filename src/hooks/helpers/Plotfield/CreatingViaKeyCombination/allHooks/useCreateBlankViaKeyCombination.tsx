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
  // const pressedKeys = useRef<Set<string>>(new Set());

  // const handleKeyDown = useCallback(
  //   (event: KeyboardEvent) => {
  //     if (!preventCreatingCommandsWhenFocus()) return;

  //     const key = event.key.toLowerCase();
  //     pressedKeys.current.add(key);

  //     console.log("Key down:", key, "Pressed keys:", Array.from(pressedKeys.current));

  //     if (
  //       pressedKeys.current.has("shift") &&
  //       (pressedKeys.current.has("n") || pressedKeys.current.has("т")) &&
  //       pressedKeys.current.size === 2
  //     ) {
  //       console.log("Shortcut detected: Shift + N (or Т)");
  //       handleCreateBlankCommand();
  //     }
  //   },
  //   [] // No dependencies needed
  // );

  // const handleKeyUp = useCallback((event: KeyboardEvent) => {
  //   const key = event.key.toLowerCase();
  //   pressedKeys.current.delete(key);

  //   console.log("Key up:", key, "Remaining keys:", Array.from(pressedKeys.current));
  // }, []);

  // const handleCreateBlankCommand = useCallback(() => {
  //   const _id = generateMongoObjectId();
  //   const focusedTopologyBlockId = getItem("focusedTopologyBlock");
  //   const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

  //   console.log("Creating blank command:", {
  //     _id,
  //     topologyBlockId: currentTopologyBlockId,
  //     episodeId,
  //   });

  //   addItemInUndoSessionStorage({
  //     _id,
  //     episodeId: episodeId || "",
  //     topologyBlockId: currentTopologyBlockId,
  //     type: "created",
  //   });

  //   const plotfieldCommandIfId = getPlotfieldCommandIfId(currentlyFocusedCommandId);
  //   const getNextCommandOrder = (currentCommand: CurrentlyFocusedCommandTypes, currentTopologyBlockId: string) => {
  //     return typeof currentCommand.commandOrder === "number"
  //       ? currentCommand.commandOrder + 1
  //       : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId });
  //   };

  //   console.log("Sending mutation:", {
  //     _id,
  //     topologyBlockId: currentTopologyBlockId,
  //     commandOrder: getNextCommandOrder(currentlyFocusedCommandId, currentTopologyBlockId),
  //   });

  //   createPlotfield.mutate({
  //     _id,
  //     topologyBlockId: currentTopologyBlockId,
  //     isElse: currentlyFocusedCommandId?.isElse,
  //     plotfieldCommandIfId,
  //     commandOrder: getNextCommandOrder(currentlyFocusedCommandId, currentTopologyBlockId),
  //   });

  //   pressedKeys.current.clear();
  // }, [createPlotfield, episodeId, currentlyFocusedCommandId, getCurrentAmountOfCommands, getItem, topologyBlockId]);

  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key.toLowerCase());
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.clear();
      console.log("pressedKeys: ", pressedKeys);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  function getPlotfieldCommandIfId(currentCommand: CurrentlyFocusedCommandTypes) {
    return currentCommand.commandName === "if" ||
      (currentCommand.commandName as AllPossiblePlotFieldComamndsTypes) === "else" ||
      (typeof currentCommand.isElse === "boolean" && currentCommand.parentId)
      ? currentCommand?.parentId
      : "";
  }
}
