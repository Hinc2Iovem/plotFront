import { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useNavigation from "../../../../../../features/Editor/Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import { CreateCommandIfBodyTypes } from "../../../../../../features/Editor/PlotField/hooks/If/useCreateCommandIf";
import useCreateBlankCommand from "../../../../../../features/Editor/PlotField/hooks/useCreateBlankCommand";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import { addItemInUndoSessionStorage } from "../../../../UndoRedo/addItemInUndoSessionStorage";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../../shared/SessionStorage/useTypedSessionStorage";

type HandleCreatingViaKeyCombinationProcessTypes<T> = {
  topologyBlockId: string;
  firstEngLetter: string;
  secondEngLetter: string;
  firstRusLetter: string;
  secondRusLetter: string;
  commandName: AllPossiblePlotFieldComamndsTypes;
  sayType?: CommandSayVariationTypes | undefined;
  createCommand: UseMutationResult<void, Error, T, unknown>;
  createCommandData?: T;
};

export default function useHandleCreatingViaKeyCombinationProcess<T>({
  topologyBlockId,
  firstEngLetter,
  firstRusLetter,
  secondEngLetter,
  secondRusLetter,
  commandName,
  sayType,
  createCommand,
  createCommandData,
}: HandleCreatingViaKeyCombinationProcessTypes<T>) {
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

  const handleCreateCommand = useCallback(() => {
    const _id = generateMongoObjectId();
    const createCommandObject = createCommandData
      ? {
          ...createCommandData,
          plotfieldCommandId: _id,
        }
      : { plotfieldCommandId: _id };

    createCommand.mutate(createCommandObject as T);

    const focusedTopologyBlockId = getItem("focusedTopologyBlock");
    const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

    addItemInUndoSessionStorage({
      _id,
      episodeId: episodeId || "",
      topologyBlockId: currentTopologyBlockId,
      type: "created",
    });

    const commandIf = commandName === "if" ? (createCommandObject as CreateCommandIfBodyTypes) : null;

    createPlotfield.mutate({
      _id,
      topologyBlockId: currentTopologyBlockId,
      commandName,
      isElse: currentlyFocusedCommandId?.isElse,
      plotfieldCommandElseId: commandIf ? commandIf?.plotFieldCommandElseId : "",
      plotfieldCommandIfElseEndId: commandIf ? commandIf?.plotFieldCommandIfElseEndId : "",
      plotfieldCommandIfId:
        currentlyFocusedCommandId.commandName === "if" ||
        (currentlyFocusedCommandId.commandName as AllPossiblePlotFieldComamndsTypes) === "else" ||
        (typeof currentlyFocusedCommandId.isElse === "boolean" && currentlyFocusedCommandId.parentId)
          ? currentlyFocusedCommandId?.parentId
          : "",
      commandOrder:
        typeof currentlyFocusedCommandId.commandOrder === "number"
          ? currentlyFocusedCommandId?.commandOrder + 1
          : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId }),
      sayType,
    });
  }, [
    commandName,
    createCommand,
    createCommandData,
    createPlotfield,
    currentlyFocusedCommandId,
    episodeId,
    getCurrentAmountOfCommands,
    getItem,
    sayType,
    topologyBlockId,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.repeat) return;
      pressedKeys.current.add(key);
      if (
        pressedKeys.current.has("shift") &&
        ((pressedKeys.current.has(firstEngLetter) && pressedKeys.current.has(secondEngLetter)) ||
          (pressedKeys.current.has(firstRusLetter) && pressedKeys.current.has(secondRusLetter))) &&
        !shortcutTriggered.current
      ) {
        shortcutTriggered.current = true;

        handleCreateCommand();
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
  }, [firstEngLetter, firstRusLetter, handleCreateCommand, secondEngLetter, secondRusLetter]);
}
