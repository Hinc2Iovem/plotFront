import { useEffect } from "react";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import useCreateSound from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/Sound/useCreateSound";

type CreateSoundViaKeyCombinationTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse: boolean;
};

export default function useCreateSoundViaKeyCombination({
  topologyBlockId,
  commandIfId,
  isElse,
}: CreateSoundViaKeyCombinationTypes) {
  const createPlotfield = useCreateBlankCommand({ topologyBlockId });
  const createSound = useCreateSound({});
  const { getTopologyBlock } = useTopologyBlocks();

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("s") && pressedKeys.has("o")) ||
          (pressedKeys.has("ы") && pressedKeys.has("щ")))
      ) {
        const _id = generateMongoObjectId();
        createPlotfield.mutate({
          _id,
          commandOrder:
            getTopologyBlock()?.topologyBlockInfo?.amountOfCommands || 2,
          topologyBlockId,
          commandIfId,
          isElse,
          commandName: "sound",
        });
        createSound.mutate({ plotfieldCommandId: _id });
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
