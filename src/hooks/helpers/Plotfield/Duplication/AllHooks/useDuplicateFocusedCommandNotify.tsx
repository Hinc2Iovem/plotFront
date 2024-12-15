import { useEffect } from "react";
import { useParams } from "react-router-dom";
import usePlotfieldCommands from "../../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useCreateSayDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSayDuplicate";
import { generateMongoObjectId } from "../../../../../utils/generateMongoObjectId";

type DuplicateFocusedCommandNotifyTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandNotify({ topologyBlockId }: DuplicateFocusedCommandNotifyTypes) {
  const { episodeId } = useParams();
  const {
    getCommandByPlotfieldCommandId,
    getCommandIfByPlotfieldCommandId,
    getCurrentAmountOfCommands,
    getCurrentAmountOfIfCommands,
  } = usePlotfieldCommands();

  const createNotify = useCreateSayDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key?.toLowerCase());

      if (
        pressedKeys.has("control") &&
        (pressedKeys.has("v") || pressedKeys.has("м")) &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        event.preventDefault();

        const currentFocusedTopologyBlockId = sessionStorage.getItem(`focusedTopologyBlock`);
        if (currentlyFocusedCommandId.commandName !== "notify") {
          console.log("Not an notify");
          return;
        }

        const currentFocusedPlotfieldCommandId = (currentFocusedPlotfieldCommand || [])[1];
        if (currentlyFocusedCommandId.type !== "command") {
          console.log("Can not copy topologyBlock, try to copy a command");
          return;
        }

        const currentCommand = getCommandByPlotfieldCommandId({
          plotfieldCommandId: currentlyFocusedCommandId._id,
          topologyBlockId: currentFocusedTopologyBlockId || topologyBlockId,
        });

        const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

        const deepLevelCommandIf = focusedCommandIf?.includes("none")
          ? null
          : (focusedCommandIf?.length || 0) > 0
          ? (focusedCommandIf?.length || 0) - 1
          : null;

        let commandIfId = "";
        let isElse = false;

        if (typeof deepLevelCommandIf === "number") {
          const currentFocusedCommandIf = (focusedCommandIf || [])[deepLevelCommandIf];
          commandIfId = currentFocusedCommandIf?.split("-")[3];
          isElse = currentFocusedCommandIf?.split("-")[0] === "else";
        }

        const currentCommandInsideIf = getCommandIfByPlotfieldCommandId({
          commandIfId,
          isElse,
          plotfieldCommandId: currentFocusedPlotfieldCommandId,
        });

        const _id = generateMongoObjectId();
        const storageKey = `items-episode-${episodeId}-topologyBlock-${topologyBlockId}`;

        const allPossiblyToBeUndoItems = sessionStorage.getItem(
          `items-episode-${episodeId}-topologyBlock-${topologyBlockId}`
        );

        if (allPossiblyToBeUndoItems) {
          const newAllPossiblyToBeUndoItems = allPossiblyToBeUndoItems
            ? `${allPossiblyToBeUndoItems},copied-${_id}`
            : `copied-${_id}`;

          sessionStorage.setItem(storageKey, newAllPossiblyToBeUndoItems);
        } else {
          sessionStorage.setItem(storageKey, `copied-${_id}`);
        }

        if (commandIfId?.trim().length) {
          createNotify.mutate({
            plotfieldCommandId: _id,
            topologyBlockId: currentFocusedTopologyBlockId || topologyBlockId,
            characterId: currentCommandInsideIf?.characterId,
            characterName: currentCommandInsideIf?.characterName,
            commandIfId: currentCommandInsideIf?.commandIfId,
            commandName: currentCommandInsideIf?.command,
            emotionName: currentCommandInsideIf?.emotionName,
            isElse: currentCommandInsideIf?.isElse,
            sayType: currentCommandInsideIf?.sayType,
            commandOrder:
              typeof currentCommandInsideIf?.commandOrder === "number"
                ? currentCommandInsideIf.commandOrder + 1
                : getCurrentAmountOfIfCommands({ commandIfId, isElse }),
            characterImg: currentCommandInsideIf?.characterImg,
            emotionId: currentCommandInsideIf?.emotionId,
            emotionImg: currentCommandInsideIf?.emotionImg,
            commandSide: currentCommandInsideIf?.commandSide || "right",
          });
        } else {
          createNotify.mutate({
            plotfieldCommandId: _id,
            topologyBlockId: currentFocusedTopologyBlockId || topologyBlockId,
            characterId: currentCommand?.characterId,
            characterName: currentCommand?.characterName,
            commandName: currentCommand?.command,
            emotionName: currentCommand?.emotionName,
            isElse: currentCommand?.isElse,
            sayType: currentCommand?.sayType,
            commandSide: currentCommand?.commandSide || "right",
            commandOrder:
              typeof currentCommand?.commandOrder === "number"
                ? currentCommand.commandOrder + 1
                : getCurrentAmountOfCommands({
                    topologyBlockId: currentFocusedTopologyBlockId || topologyBlockId,
                  }),
            characterImg: currentCommand?.characterImg,
            emotionId: currentCommand?.emotionId,
            emotionImg: currentCommand?.emotionImg,
          });
        }
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
  }, []);
}
