import { useCallback, useEffect, useRef } from "react";
import { preventCreatingCommandsWhenFocus } from "../../../preventCreatingCommandsWhenFocus";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import usePlotfieldCommands from "../../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useNavigation from "../../../../../../features/Editor/Context/Navigation/NavigationContext";
import useCreateBlankCommand from "../../../../../../features/Editor/PlotField/hooks/useCreateBlankCommand";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { UseMutationResult } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { addItemInUndoSessionStorage } from "../../../../UndoRedo/addItemInUndoSessionStorage";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../../shared/SessionStorage/useTypedSessionStorage";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import { CreateCommandIfBodyTypes } from "../../../../../../features/Editor/PlotField/hooks/If/useCreateCommandIf";

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

  const pressedKeys = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) {
        return;
      }

      const key = event.key?.toLowerCase();
      if (key) pressedKeys.current.add(key);

      if (
        pressedKeys.current.has("shift") &&
        ((pressedKeys.current.has(firstEngLetter) && pressedKeys.current.has(secondEngLetter)) ||
          (pressedKeys.current.has(firstRusLetter) && pressedKeys.current.has(secondRusLetter)))
      ) {
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
      }
    },
    [
      firstEngLetter,
      firstRusLetter,
      secondEngLetter,
      secondRusLetter,
      topologyBlockId,
      createCommand,
      createCommandData,
      createPlotfield,
      getItem,
      commandName,
      currentlyFocusedCommandId,
      episodeId,
      getCurrentAmountOfCommands,
      sayType,
    ]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const key = event.key?.toLowerCase();
    if (key) pressedKeys.current.delete(key);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}
