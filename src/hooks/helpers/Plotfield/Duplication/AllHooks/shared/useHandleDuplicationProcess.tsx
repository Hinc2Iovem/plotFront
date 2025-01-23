import { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
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
    const pressedKeys = new Set<string>();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return; // Avoid repeating key press
      pressedKeys.add(key);

      if (pressedKeys.has("control") && (pressedKeys.has("v") || pressedKeys.has("м"))) {
        event.preventDefault();

        const allowed = preventCreatingCommandsWhenFocus();
        if (!allowed) {
          return; // Exit early if command creation isn't allowed
        }

        if (isValidForDuplication()) {
          handleDuplication();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isValidForDuplication, handleDuplication]);
}
