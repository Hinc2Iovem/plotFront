import { useEffect } from "react";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateSayWithCertainCharacter from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/Say/useCreateSayWithCertainCharacter";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import { useParams } from "react-router-dom";

type CreateCertainCharacterViaKeyCombinationTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse: boolean;
};

export default function useCreateCertainCharacterViaKeyCombination({
  topologyBlockId,
}: CreateCertainCharacterViaKeyCombinationTypes) {
  const { storyId } = useParams();
  const { episodeId } = useParams();

  const createCharacter = useCreateSayWithCertainCharacter({
    topologyBlockId,
  });
  const { getTopologyBlock } = useTopologyBlocks();

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
      pressedKeys.add(event.key.toLowerCase());
      console.log(event.key);

      if (
        (pressedKeys.has("c") || pressedKeys.has("с")) &&
        Object.keys(allPossibleNumbers).includes(event.key)
      ) {
        const numberPressed = Object.entries(allPossibleNumbers).find(
          (key) => key[0] === event.key
        )?.[1];
        console.log("numberPressed: ", numberPressed);

        const keyByStory = `story-${storyId}-shift-${numberPressed}`;
        const keyByEpisode = `episode-${episodeId}-shift-${numberPressed}`;
        const savedValue = localStorage.getItem(keyByEpisode)
          ? localStorage.getItem(keyByEpisode)
          : localStorage.getItem(keyByStory);
        if (!savedValue) {
          console.log("You haven't assigned any characters yet.");
          return;
        }

        const plotfieldCommandId = generateMongoObjectId();
        createCharacter.mutate({
          topologyBlockId,
          characterId: savedValue.split("-")[0],
          characterName: savedValue.split("-")[1],
          _id: plotfieldCommandId,
          commandOrder:
            getTopologyBlock()?.topologyBlockInfo?.amountOfCommands || 2,
          commandName: "say",
          sayType: "character",
        });
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
