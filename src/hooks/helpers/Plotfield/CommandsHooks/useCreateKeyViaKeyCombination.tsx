import { useParams } from "react-router-dom";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateKey from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/Key/useCreateKey";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import { useEffect } from "react";
import { preventCreatingCommandsWhenFocus } from "../preventCreatingCommandsWhenFocus";

type CreateKeyViaKeyCombinationTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse: boolean;
};

export default function useCreateKeyViaKeyCombination({
  topologyBlockId,
  commandIfId,
  isElse,
}: CreateKeyViaKeyCombinationTypes) {
  const { storyId } = useParams();
  const createPlotfield = useCreateBlankCommand({ topologyBlockId });
  const createKey = useCreateKey({ storyId: storyId || "" });
  const { getTopologyBlock } = useTopologyBlocks();

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) {
        console.log("You are inside input element");
        return;
      }
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("k") && pressedKeys.has("e")) ||
          (pressedKeys.has("л") && pressedKeys.has("у")))
      ) {
        const _id = generateMongoObjectId();
        createPlotfield.mutate({
          _id,
          commandOrder:
            getTopologyBlock()?.topologyBlockInfo?.amountOfCommands || 2,
          topologyBlockId,
          commandIfId,
          isElse,
          commandName: "key",
        });
        createKey.mutate({ plotfieldCommandId: _id });
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
