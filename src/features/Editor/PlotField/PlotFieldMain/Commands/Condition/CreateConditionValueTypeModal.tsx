import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import useNavigation from "../../../../Context/Navigation/NavigationContext";
import { makeTopologyBlockName } from "../../../../Flowchart/utils/makeTopologyBlockName";
import useAddAnotherConditionBlock from "../../../hooks/Condition/ConditionBlock/useAddAnotherConditionBlock";
import useConditionBlocks from "./Context/ConditionContext";

type CreateConditionValueTypeModalTypes = {
  commandConditionId: string;
  plotfieldCommandId: string;
};

export default function CreateConditionValueTypeModal({
  commandConditionId,
  plotfieldCommandId,
}: CreateConditionValueTypeModalTypes) {
  const { episodeId } = useParams();
  const getAmountOfOnlyIfConditionBlocks = useConditionBlocks((state) => state.getAmountOfOnlyIfConditionBlocks);
  const addConditionBlock = useConditionBlocks((state) => state.addConditionBlock);

  const { currentTopologyBlock, updateAmountOfChildBlocks } = useNavigation();

  const createCommandinsideCondition = useAddAnotherConditionBlock({
    commandConditionId,
    episodeId: episodeId || "",
  });

  const handleConditionValueCreation = () => {
    const targetBlockId = generateMongoObjectId();
    const conditionBlockId = generateMongoObjectId();

    updateAmountOfChildBlocks("add");

    addConditionBlock({
      conditionBlock: {
        conditionBlockId,
        conditionBlockVariations: [],
        logicalOperators: "",
        isElse: false,
        orderOfExecution:
          getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) < 1
            ? 1
            : getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) + 1,
        targetBlockId,
        topologyBlockName: makeTopologyBlockName({
          name: currentTopologyBlock?.name || "",
          amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
        }),
      },
      plotfieldCommandId,
    });

    createCommandinsideCondition.mutate({
      coordinatesX: currentTopologyBlock?.coordinatesX,
      coordinatesY: currentTopologyBlock?.coordinatesY,
      sourceBlockName: makeTopologyBlockName({
        name: currentTopologyBlock?.name || "",
        amountOfOptions: currentTopologyBlock?.topologyBlockInfo?.amountOfChildBlocks || 1,
      }),
      targetBlockId,
      topologyBlockId: currentTopologyBlock?._id,
      conditionBlockId,
      orderOfExecution:
        getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) < 1
          ? 1
          : getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }),
    });
  };

  return (
    <Button
      className="active:scale-[.99] absolute right-[10px] text-white top-[10px] bg-brand-gradient hover:shadow-md hover:shadow-brand-gradient-left transition-all"
      onClick={handleConditionValueCreation}
    >
      + Блок
    </Button>
  );
}
