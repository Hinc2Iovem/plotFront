import useDeleteConditionBlockVariation from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/useDeleteConditionBlockVariation";
import { ConditionValueVariationType } from "@/types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../Context/ConditionContext";
import DeleteVariationModal from "./DeleteVariationModal";

type DeleteVariationConditionTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  setSuggestToDeleteVariation: React.Dispatch<React.SetStateAction<boolean>>;
  variationType: ConditionValueVariationType;
  conditionBlockVariationId: string;
};

export default function DeleteVariationCondition({
  conditionBlockId,
  conditionBlockVariationId,
  index,
  plotfieldCommandId,
  setSuggestToDeleteVariation,
  variationType,
}: DeleteVariationConditionTypes) {
  const getAmountOfConditionBlockVariations = useConditionBlocks((state) => state.getAmountOfConditionBlockVariations);
  const removeConditionBlockVariation = useConditionBlocks((state) => state.removeConditionBlockVariation);
  const deleteVariationAsync = useDeleteConditionBlockVariation({
    conditionBlockVariationIdParams: conditionBlockVariationId,
  });

  return (
    <DeleteVariationModal
      onClick={() => {
        setSuggestToDeleteVariation(false);
        const currentIndex =
          index > 0 && getAmountOfConditionBlockVariations({ conditionBlockId, plotfieldCommandId }) - 1 === index
            ? index - 1
            : index;

        removeConditionBlockVariation({
          conditionBlockId,
          conditionBlockVariationId,
          plotfieldCommandId,
          index: currentIndex,
        });
        // currentIndex will allow to remove logicalOperator of a previous variation, when there are no other variation to replace current one to be compared with the logicalOperator of the previous variation
        deleteVariationAsync.mutate({ type: variationType, conditionBlockId, index: currentIndex });
      }}
    />
  );
}
