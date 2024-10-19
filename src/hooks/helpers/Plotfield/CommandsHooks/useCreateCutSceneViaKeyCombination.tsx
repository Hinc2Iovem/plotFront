import { useEffect } from "react";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import useCreateCutScene from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/CutScene/useCreateCutScene";

type CreateCutSceneViaKeyCombinationTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse: boolean;
};

export default function useCreateCutSceneViaKeyCombination({
  topologyBlockId,
  commandIfId,
  isElse,
}: CreateCutSceneViaKeyCombinationTypes) {
  const createPlotfield = useCreateBlankCommand({ topologyBlockId });
  const createCutScene = useCreateCutScene({});
  const { getTopologyBlock } = useTopologyBlocks();

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("c") && pressedKeys.has("u")) ||
          (pressedKeys.has("с") && pressedKeys.has("г")))
      ) {
        const _id = generateMongoObjectId();
        createPlotfield.mutate({
          _id,
          commandOrder:
            getTopologyBlock()?.topologyBlockInfo?.amountOfCommands || 2,
          topologyBlockId,
          commandIfId,
          isElse,
          commandName: "cutscene",
        });
        createCutScene.mutate({ plotfieldCommandId: _id });
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
