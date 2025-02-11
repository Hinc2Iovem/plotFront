import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useCreateSayWithCertainCharacter from "../../../../../features/Editor/PlotField/hooks/Say/post/useCreateSayWithCertainCharacter";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";
import { preventCreatingCommandsWhenFocus } from "../../preventCreatingCommandsWhenFocus";
import usePlotfieldCommands from "../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useNavigation from "../../../../../features/Editor/Context/Navigation/NavigationContext";
import { addItemInUndoSessionStorage } from "../../../UndoRedo/addItemInUndoSessionStorage";
import useTypedSessionStorage, { SessionStorageKeys } from "../../../shared/SessionStorage/useTypedSessionStorage";

type CreateCertainCharacterViaKeyCombinationTypes = {
  topologyBlockId: string;
};

const allPossibleNumbers = {
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

export default function useCreateCertainCharacterViaKeyCombination({
  topologyBlockId,
}: CreateCertainCharacterViaKeyCombinationTypes) {
  const { storyId, episodeId } = useParams();
  const { currentlyFocusedCommandId } = useNavigation();
  const createCharacter = useCreateSayWithCertainCharacter({
    topologyBlockId,
  });
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();

  const pressedKeys = useRef(new Set<string>());

  const getSavedValue = useCallback(
    (numberPressed: number) => {
      const keyByStory = `story-${storyId}-c-${numberPressed}`;
      const keyByEpisode = `episode-${episodeId}-c-${numberPressed}`;
      return localStorage.getItem(keyByEpisode) || localStorage.getItem(keyByStory);
    },
    [storyId, episodeId]
  );
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) return;

      const pressedKey = event.key?.toLowerCase();
      pressedKeys.current.add(event.key?.toLowerCase());

      if (
        (pressedKeys.current.has("c") || pressedKeys.current.has("с")) &&
        Object.keys(allPossibleNumbers).includes(event.key)
      ) {
        const numberPressed = allPossibleNumbers[pressedKey as keyof typeof allPossibleNumbers];
        const savedValue = getSavedValue(numberPressed);

        if (!savedValue) {
          console.log("You haven't assigned any characters yet.");
          return;
        }

        const focusedTopologyBlockId = getItem("focusedTopologyBlock");

        const newPlotfieldCommandId = generateMongoObjectId();
        const plotfieldCommandIfId =
          typeof currentlyFocusedCommandId.isElse === "boolean" ? currentlyFocusedCommandId.parentId : "";

        const currentTopologyBlockId = focusedTopologyBlockId?.trim().length ? focusedTopologyBlockId : topologyBlockId;

        addItemInUndoSessionStorage({
          _id: newPlotfieldCommandId,
          episodeId: episodeId || "",
          topologyBlockId: currentTopologyBlockId,
          type: "created",
        });

        createCharacter.mutate({
          topologyBlockId: currentTopologyBlockId,
          characterId: savedValue.split("-")[0],
          characterName: savedValue.split("-")[1],
          _id: newPlotfieldCommandId,
          commandName: "say",
          sayType: "character",
          plotfieldCommandIfId,
          isElse: currentlyFocusedCommandId.isElse,
          commandOrder:
            typeof currentlyFocusedCommandId.commandOrder === "number"
              ? currentlyFocusedCommandId.commandOrder
              : getCurrentAmountOfCommands({
                  topologyBlockId: currentTopologyBlockId,
                }),
        });
      }
    },
    [
      episodeId,
      topologyBlockId,
      createCharacter,
      currentlyFocusedCommandId,
      getItem,
      getCurrentAmountOfCommands,
      getSavedValue,
    ]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    pressedKeys.current.delete(event.key?.toLowerCase());
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
