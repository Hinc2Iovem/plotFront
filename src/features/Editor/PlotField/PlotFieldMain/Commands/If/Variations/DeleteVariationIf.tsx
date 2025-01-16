import { ConditionValueVariationType } from "@/types/StoryEditor/PlotField/Condition/ConditionTypes";
import useIfVariations from "../Context/IfContext";
import useDeleteIfVariation from "@/features/Editor/PlotField/hooks/If/BlockVariations/useDeleteIfVariation";
import DeleteVariationModal from "../../Condition/PlotfieldInsideConditionBlock/DeleteVariation/DeleteVariationModal";

type DeleteVariationIfTypes = {
  ifId: string;
  plotfieldCommandId: string;
  index: number;
  variationType: ConditionValueVariationType;
  ifVariationId: string;
  setSuggestDeletingVariation: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteVariationIf({
  ifId,
  ifVariationId,
  index,
  plotfieldCommandId,
  variationType,
  setSuggestDeletingVariation,
}: DeleteVariationIfTypes) {
  const { removeIfVariation, getAmountOfIfVariations } = useIfVariations();
  const deleteVariationAsync = useDeleteIfVariation({
    ifVariationIdParams: ifVariationId,
  });

  return (
    <DeleteVariationModal
      onClick={() => {
        setSuggestDeletingVariation(false);
        const currentIndex =
          index > 0 && getAmountOfIfVariations({ plotfieldCommandId }) - 1 === index ? index - 1 : index;

        removeIfVariation({
          ifVariationId,
          plotfieldCommandId,
          index: currentIndex,
        });
        // currentIndex will allow to remove logicalOperator of a previous variation, when there are no other variation to replace current one to be compared with the logicalOperator of the previous variation
        deleteVariationAsync.mutate({ type: variationType, ifId, index: currentIndex });
      }}
    />
  );
}
