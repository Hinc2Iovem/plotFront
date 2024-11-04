import { useEffect } from "react";
import useTopologyBlocks from "../../../../features/Editor/Flowchart/Context/TopologyBlockContext";
import useCreateBlankCommand from "../../../../features/Editor/PlotField/hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../utils/generateMongoObjectId";
import useCreateCondition from "../../../../features/Editor/PlotField/hooks/Condition/useCreateCondition";
import { useParams } from "react-router-dom";
import { makeTopologyBlockName } from "../../../../features/Editor/Flowchart/utils/makeTopologyBlockName";
import useConditionBlocks from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";
import { preventCreatingCommandsWhenFocus } from "../preventCreatingCommandsWhenFocus";
import usePlotfieldCommands from "../../../../features/Editor/PlotField/Context/PlotFieldContext";
import useCreateBlankCommandInsideIf from "../../../../features/Editor/PlotField/hooks/If/useCreateBlankCommandInsideIf";

type CreateConditionViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateConditionViaKeyCombination({
  topologyBlockId,
}: CreateConditionViaKeyCombinationTypes) {
  const { episodeId } = useParams();
  const createPlotfield = useCreateBlankCommand({
    topologyBlockId,
    episodeId: episodeId || "",
  });
  const createCondition = useCreateCondition({ episodeId: episodeId || "" });
  const { getTopologyBlock, updateAmountOfChildBlocks } = useTopologyBlocks();
  const { addConditionBlock } = useConditionBlocks();

  const { getCurrentAmountOfIfCommands, getCommandIfByPlotfieldCommandId } =
    usePlotfieldCommands();

  const createPlotfieldInsideIf = useCreateBlankCommandInsideIf({
    topologyBlockId,
  });

  useEffect(() => {
    const pressedKeys = new Set<string>();
    const handleKeyDown = (event: KeyboardEvent) => {
      const allowed = preventCreatingCommandsWhenFocus();
      if (!allowed) {
        // console.log("You are inside input element");
        return;
      }
      pressedKeys.add(event.key.toLowerCase());

      if (
        pressedKeys.has("shift") &&
        ((pressedKeys.has("c") && pressedKeys.has("o")) ||
          (pressedKeys.has("с") && pressedKeys.has("щ")))
      ) {
        const _id = generateMongoObjectId();
        updateAmountOfChildBlocks("add");

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
        if ((focusedCommand || [])[1] !== plotfieldCommandId) {
          commandOrder =
            (getCommandIfByPlotfieldCommandId({
              plotfieldCommandId: (focusedCommand || [])[1] || "",
              commandIfId: commandIfId || "",
              isElse: isElse || false,
            })?.commandOrder || 0) + 1;
        }

        if (commandIfId?.trim().length) {
          createPlotfieldInsideIf.mutate({
            _id,
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            commandIfId,
            isElse: isElse || false,
            command: "condition",
            commandOrder:
              typeof commandOrder === "number"
                ? commandOrder
                : getCurrentAmountOfIfCommands({
                    commandIfId,
                    isElse: isElse || false,
                  }),
          });
        } else {
          createPlotfield.mutate({
            _id,
            topologyBlockId: currentTopologyBlockId || topologyBlockId,
            commandIfId,
            isElse,
            commandName: "condition",
          });
        }

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
          topologyBlockId: currentTopologyBlockId || topologyBlockId,
          conditionBlockId,
          plotfieldCommandId: _id,
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
