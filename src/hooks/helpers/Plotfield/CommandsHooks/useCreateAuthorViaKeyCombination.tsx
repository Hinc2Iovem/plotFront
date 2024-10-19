import { useEffect } from "react";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import useCreateSayCommandBlank from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/Say/useCreateSayCommandBlank";

type CreateAuthorViaKeyCombinationTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse: boolean;
};

export default function useCreateAuthorViaKeyCombination({
  topologyBlockId,
  commandIfId,
  isElse,
}: CreateAuthorViaKeyCombinationTypes) {
  const createPlotfield = useCreateBlankCommand({ topologyBlockId });
  const createAuthor = useCreateSayCommandBlank({ topologyBlockId });
  const { getTopologyBlock } = useTopologyBlocks();

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("a") && pressedKeys.has("u")) ||
          (pressedKeys.has("ф") && pressedKeys.has("г")))
      ) {
        const _id = generateMongoObjectId();
        createPlotfield.mutate({
          _id,
          commandOrder:
            getTopologyBlock()?.topologyBlockInfo?.amountOfCommands || 2,
          topologyBlockId,
          commandIfId,
          isElse,
          commandName: "say",
          sayType: "author",
        });
        createAuthor.mutate({ plotfieldCommandId: _id, type: "author" });
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
