import { useEffect } from "react";
import { preventCreatingCommandsWhenFocus } from "../../../preventCreatingCommandsWhenFocus";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import usePlotfieldCommands from "../../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useNavigation from "../../../../../../features/Editor/Context/Navigation/NavigationContext";
import useCreateBlankCommand from "../../../../../../features/Editor/PlotField/hooks/useCreateBlankCommand";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { UseMutationResult } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { addItemInUndoSessionStorage } from "../../../../UndoRedo/addItemInUndoSessionStorage";

type HandleCreatingViaKeyCombinationProcessTypes<T> = {
  topologyBlockId: string;
  firstEngLetter: string;
  secondEngLetter: string;
  firstRusLetter: string;
  secondRusLetter: string;
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
  sayType,
  createCommand,
  createCommandData,
}: HandleCreatingViaKeyCombinationProcessTypes<T>) {
  const { episodeId } = useParams();

  const { getCurrentAmountOfCommands } = usePlotfieldCommands();
  const { currentlyFocusedCommandId } = useNavigation();
  const createPlotfield = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) {
        // console.log("You are inside input element");
        return;
      }
      pressedKeys.add(event.key?.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has(firstEngLetter) && pressedKeys.has(secondEngLetter)) ||
          (pressedKeys.has(firstRusLetter) && pressedKeys.has(secondRusLetter)))
      ) {
        const _id = generateMongoObjectId();
        const createCommandObject = createCommandData
          ? {
              ...createCommandData,
              plotfieldCommandId: _id,
            }
          : { plotfieldCommandId: _id };

        createCommand.mutate(createCommandObject as T);

        const focusedTopologyBlockId = sessionStorage.getItem("focusedTopologyBlock");

        const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

        const plotfieldCommandElseId = generateMongoObjectId();
        const plotfieldCommandIfElseEndId = generateMongoObjectId();

        addItemInUndoSessionStorage({
          _id,
          episodeId: episodeId || "",
          topologyBlockId: currentTopologyBlockId,
          type: "created",
        });

        createPlotfield.mutate({
          _id,
          topologyBlockId: currentTopologyBlockId,
          commandName: "achievement",
          isElse: currentlyFocusedCommandId?.isElse,
          plotfieldCommandElseId,
          plotfieldCommandIfElseEndId,
          plotfieldCommandIfId:
            typeof currentlyFocusedCommandId.isElse === "boolean" ? currentlyFocusedCommandId?.parentId : "",
          commandIfId: currentlyFocusedCommandId?.parentId || "",
          commandOrder:
            typeof currentlyFocusedCommandId.commandOrder === "number"
              ? currentlyFocusedCommandId?.commandOrder + 1
              : getCurrentAmountOfCommands({ topologyBlockId: currentTopologyBlockId }),
          sayType,
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    topologyBlockId,
    createCommand,
    createCommandData,
    createPlotfield,
    currentlyFocusedCommandId,
    firstEngLetter,
    firstRusLetter,
    secondEngLetter,
    secondRusLetter,
    getCurrentAmountOfCommands,
    sayType,
  ]);
}
