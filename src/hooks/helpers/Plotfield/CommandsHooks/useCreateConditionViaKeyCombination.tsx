import { useEffect } from "react";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import useCreateCondition from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/Condition/useCreateCondition";
import { useParams } from "react-router-dom";
import { makeTopologyBlockName } from "../../../../features/Editor/Flowchart/utils/makeTopologyBlockName";
import useConditionBlocks from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";

type CreateConditionViaKeyCombinationTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse: boolean;
};

export default function useCreateConditionViaKeyCombination({
  topologyBlockId,
  commandIfId,
  isElse,
}: CreateConditionViaKeyCombinationTypes) {
  const { episodeId } = useParams();
  const createPlotfield = useCreateBlankCommand({ topologyBlockId });
  const createCondition = useCreateCondition({ episodeId: episodeId || "" });
  const { getTopologyBlock } = useTopologyBlocks();
  const { addConditionBlock } = useConditionBlocks();

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("c") && pressedKeys.has("o")) ||
          (pressedKeys.has("с") && pressedKeys.has("щ")))
      ) {
        const _id = generateMongoObjectId();
        createPlotfield.mutate({
          _id,
          commandOrder:
            getTopologyBlock()?.topologyBlockInfo?.amountOfCommands || 2,
          topologyBlockId,
          commandIfId,
          isElse,
          commandName: "condition",
        });

        const newTopologyBlockId = generateMongoObjectId();
        const conditionBlockId = generateMongoObjectId();
        addConditionBlock({
          plotfieldCommandId: _id,
          conditionBlock: {
            conditionBlockId,
            conditionType: "else",
            isElse: true,
            orderOfExecution: null,
            targetBlockId: newTopologyBlockId,
            topologyBlockName: makeTopologyBlockName({
              name: getTopologyBlock()?.name || "",
              amountOfOptions:
                getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
            }),
            conditionName: "",
            conditionValue: null,
          },
        });

        createCondition.mutate({
          coordinatesX: getTopologyBlock().coordinatesX,
          coordinatesY: getTopologyBlock().coordinatesY,
          sourceBlockName: makeTopologyBlockName({
            name: getTopologyBlock()?.name || "",
            amountOfOptions:
              getTopologyBlock()?.topologyBlockInfo?.amountOfChildBlocks || 1,
          }),
          targetBlockId: newTopologyBlockId,
          topologyBlockId,
          conditionBlockId,
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
