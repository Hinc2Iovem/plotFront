import useAddNewLogicalOperator from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useAddNewLogicalOperator";
import useAddNewConditionBlockVariation from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/useAddNewConditionBlockVariation";
import { ConditionValueVariationType } from "@/types/StoryEditor/PlotField/Condition/ConditionTypes";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import CreateVariationButton from "../../../components/CreateVariationButton";
import useConditionBlocks from "../Context/ConditionContext";

type CreateConditionVariationButtonTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
};

export default function CreateConditionVariationButton({
  conditionBlockId,
  plotfieldCommandId,
}: CreateConditionVariationButtonTypes) {
  const addConditionBlockVariation = useConditionBlocks((state) => state.addConditionBlockVariation);
  const getAmountOfConditionBlockVariations = useConditionBlocks((state) => state.getAmountOfConditionBlockVariations);
  const addNewLogicalOperator = useConditionBlocks((state) => state.addNewLogicalOperator);

  const createConditionVariation = useAddNewConditionBlockVariation({ conditionBlockId });
  const addLogicalOperator = useAddNewLogicalOperator({ conditionBlockId });

  const handleCreatingConditionVariation = ({ value }: { value: ConditionValueVariationType }) => {
    const _id = generateMongoObjectId();
    createConditionVariation.mutate({
      _id,
      type: value,
    });

    const amount = getAmountOfConditionBlockVariations({ conditionBlockId, plotfieldCommandId });

    if (amount > 0) {
      addNewLogicalOperator({ conditionBlockId, logicalOperator: "&&", plotfieldCommandId });
      addLogicalOperator.mutate({ logicalOperator: "&&" });
    }

    addConditionBlockVariation({
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariation: {
        conditionBlockVariationId: _id,
        type: value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return <CreateVariationButton buttonClasses="self-end" handleCreatingVariation={handleCreatingConditionVariation} />;
}
