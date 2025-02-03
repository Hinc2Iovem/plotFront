import { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import useNavigation from "../../../../../../features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import { OmittedCommandNames } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import { addItemInUndoSessionStorage } from "../../../../UndoRedo/addItemInUndoSessionStorage";
import { CreateDuplicateSayOnMutationTypes } from "../../createDuplicateTypes";
import { preventCreatingCommandsWhenFocus } from "../../../preventCreatingCommandsWhenFocus";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../../shared/SessionStorage/useTypedSessionStorage";

type HandleDuplicationProcessTypes = {
  topologyBlockId: string;
  episodeId: string;
  createCommand: UseMutationResult<
    void,
    Error,
    CreateDuplicateSayOnMutationTypes,
    {
      prevCommands: {
        prevCommands: unknown;
      };
    }
  >;
  commandName: OmittedCommandNames;
};

export default function useHandleDuplicationProcess({
  episodeId,
  topologyBlockId,
  createCommand,
  commandName,
}: HandleDuplicationProcessTypes) {
  const { currentlyFocusedCommandId } = useNavigation();
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { getCommandByPlotfieldCommandId, getCurrentAmountOfCommands } = usePlotfieldCommands();
  const shortcutTriggered = useRef(false);
  const pressedKeys = useRef(new Set());

  const isValidForDuplication = useCallback(() => {
    if (currentlyFocusedCommandId.commandName !== commandName) {
      console.log(`Not an ${commandName}`);
      return false;
    }

    if (currentlyFocusedCommandId.type !== "command") {
      console.log("Can not copy topologyBlock, try to copy a command");
      return false;
    }
    return true;
  }, [currentlyFocusedCommandId, commandName]);

  const handleDuplication = useCallback(() => {
    const currentFocusedTopologyBlockId = getItem(`focusedTopologyBlock`);
    const currentCommand = getCommandByPlotfieldCommandId({
      plotfieldCommandId: currentlyFocusedCommandId._id,
      topologyBlockId: currentFocusedTopologyBlockId || topologyBlockId,
    });

    const _id = generateMongoObjectId();
    const currentTopologyBlockId = currentFocusedTopologyBlockId?.trim().length
      ? currentFocusedTopologyBlockId
      : topologyBlockId;

    addItemInUndoSessionStorage({
      _id,
      episodeId: episodeId || "",
      topologyBlockId: currentTopologyBlockId,
      type: "created",
    });

    createCommand.mutate({
      plotfieldCommandId: _id,
      topologyBlockId: currentTopologyBlockId,
      characterId: currentCommand?.characterId,
      characterName: currentCommand?.characterName,
      commandName: currentCommand?.command,
      emotionName: currentCommand?.emotionName,
      plotfieldCommandIfId: currentCommand?.plotfieldCommandIfId,
      isElse: currentCommand?.isElse,
      sayType: currentCommand?.sayType,
      commandOrder:
        typeof currentlyFocusedCommandId.commandOrder === "number"
          ? currentlyFocusedCommandId?.commandOrder + 1
          : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId }),
      characterImg: currentCommand?.characterImg,
      commandSide: currentCommand?.commandSide,
      emotionId: currentCommand?.emotionId,
      emotionImg: currentCommand?.emotionImg,
    });

    pressedKeys.current.clear();
  }, [
    episodeId,
    topologyBlockId,
    createCommand,
    currentlyFocusedCommandId,
    getItem,
    getCommandByPlotfieldCommandId,
    getCurrentAmountOfCommands,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (event.repeat) return;
      pressedKeys.current.add(key);

      if (
        pressedKeys.current.has("control") &&
        (pressedKeys.current.has("v") || pressedKeys.current.has("м")) &&
        !shortcutTriggered.current
      ) {
        event.preventDefault();

        const allowed = preventCreatingCommandsWhenFocus();
        if (!allowed) {
          return;
        }

        if (isValidForDuplication()) {
          shortcutTriggered.current = true;
          handleDuplication();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      pressedKeys.current.delete(key);

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
  }, [isValidForDuplication, handleDuplication]);
}
