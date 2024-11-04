import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useCreateSayWithCertainCharacter from "../../../../features/Editor/PlotField/hooks/Say/useCreateSayWithCertainCharacter";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import { preventCreatingCommandsWhenFocus } from "../preventCreatingCommandsWhenFocus";
import usePlotfieldCommands from "../../../../features/Editor/PlotField/Context/PlotFieldContext";

type CreateCertainCharacterViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateCertainCharacterViaKeyCombination({
  topologyBlockId,
}: CreateCertainCharacterViaKeyCombinationTypes) {
  const { storyId } = useParams();
  const { episodeId } = useParams();

  const createCharacter = useCreateSayWithCertainCharacter({
    topologyBlockId,
  });

  const {
    getCommandIfByPlotfieldCommandId,
    getCurrentAmountOfIfCommands,
    getCurrentAmountOfCommands,
    getCommandOnlyByPlotfieldCommandId,
  } = usePlotfieldCommands();

  useEffect(() => {
    const pressedKeys = new Set<string>();
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
    const handleKeyDown = (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) {
        // console.log("You are inside input element");
        return;
      }
      pressedKeys.add(event.key.toLowerCase());

      if (
        (pressedKeys.has("c") || pressedKeys.has("с")) &&
        Object.keys(allPossibleNumbers).includes(event.key)
      ) {
        const numberPressed = Object.entries(allPossibleNumbers).find(
          (key) => key[0] === event.key
        )?.[1];

        const keyByStory = `story-${storyId}-c-${numberPressed}`;
        const keyByEpisode = `episode-${episodeId}-c-${numberPressed}`;

        const savedValue = localStorage.getItem(keyByEpisode)
          ? localStorage.getItem(keyByEpisode)
          : localStorage.getItem(keyByStory);

        if (!savedValue) {
          console.log("You haven't assigned any characters yet.");
          return;
        }

        const currentTopologyBlockId = sessionStorage.getItem(
          "focusedTopologyBlock"
        );
        const commandIf = sessionStorage
          .getItem("focusedCommandIf")
          ?.split("?")
          .filter(Boolean);

        const deepLevelCommandIf = commandIf?.includes("none")
          ? null
          : (commandIf?.length || 0) > 0
          ? (commandIf?.length || 0) - 1
          : null;
        let isElse;
        let commandIfId;
        let plotfieldCommandId;
        if (typeof deepLevelCommandIf === "number") {
          const currentCommandIf = (commandIf || [])[deepLevelCommandIf];
          isElse = currentCommandIf?.split("-")[0] === "else";
          plotfieldCommandId = currentCommandIf?.split("-")[1];
          commandIfId = currentCommandIf?.split("-")[3];
        }

        const focusedCommand = sessionStorage
          .getItem("focusedCommand")
          ?.split("-");
        let commandOrder;

        if (commandIfId?.trim().length) {
          if ((focusedCommand || [])[1] !== plotfieldCommandId) {
            commandOrder =
              (getCommandIfByPlotfieldCommandId({
                plotfieldCommandId: (focusedCommand || [])[1] || "",
                commandIfId: commandIfId || "",
                isElse: isElse || false,
              })?.commandOrder || 0) + 1;
          }
        } else {
          commandOrder =
            (getCommandOnlyByPlotfieldCommandId({
              plotfieldCommandId: (focusedCommand || [])[1] || "",
            })?.commandOrder || 0) + 1;
        }

        const newPlotfieldCommandId = generateMongoObjectId();
        if (commandIfId?.trim().length) {
          createCharacter.mutate({
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            characterId: savedValue.split("-")[0],
            characterName: savedValue.split("-")[1],
            _id: newPlotfieldCommandId,
            commandName: "say",
            sayType: "character",
            commandIfId,
            isElse,
            commandOrder:
              typeof commandOrder === "number"
                ? commandOrder
                : getCurrentAmountOfIfCommands({
                    commandIfId,
                    isElse: isElse || false,
                  }),
          });
        } else {
          createCharacter.mutate({
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            characterId: savedValue.split("-")[0],
            characterName: savedValue.split("-")[1],
            _id: newPlotfieldCommandId,
            commandName: "say",
            sayType: "character",
            commandIfId,
            isElse,
            commandOrder:
              typeof commandOrder === "number"
                ? commandOrder
                : getCurrentAmountOfCommands({
                    topologyBlockId: currentTopologyBlockId || topologyBlockId,
                  }),
          });
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
