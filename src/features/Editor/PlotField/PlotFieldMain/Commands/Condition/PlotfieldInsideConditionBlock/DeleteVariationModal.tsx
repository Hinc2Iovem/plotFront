import { useEffect, useRef } from "react";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useDeleteConditionBlockVariation from "../../../../hooks/Condition/ConditionBlock/BlockVariations/useDeleteConditionBlockVariation";
import useConditionBlocks from "../Context/ConditionContext";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";

type DeleteVariationModalTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToDeleteVariation: boolean;
  setSuggestToDeleteVariation: React.Dispatch<React.SetStateAction<boolean>>;
  variationType: ConditionValueVariationType;
  conditionBlockVariationId: string;
};

export default function DeleteVariationModal({
  index,
  conditionBlockId,
  plotfieldCommandId,
  variationType,
  suggestToDeleteVariation,
  conditionBlockVariationId,
  setSuggestToDeleteVariation,
}: DeleteVariationModalTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef,
    setShowModal: setSuggestToDeleteVariation,
    showModal: suggestToDeleteVariation,
  });

  return (
    <aside
      ref={modalRef}
      className={`absolute ${
        suggestToDeleteVariation ? "" : "hidden"
      } right-0 z-[10] bg-primary-darker min-w-fit w-full rounded-md p-[.5rem] flex flex-col gap-[1rem] top-0 translate-y-[4rem]`}
    >
      <DeleteVariationButton
        index={index}
        plotfieldCommandId={plotfieldCommandId}
        conditionBlockId={conditionBlockId}
        variationType={variationType}
        suggestToDeleteVariation={suggestToDeleteVariation}
        conditionBlockVariationId={conditionBlockVariationId}
        setSuggestToDeleteVariation={setSuggestToDeleteVariation}
      />
    </aside>
  );
}

type DeleteVariationButtonTypes = {
  index: number;
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionBlockVariationId: string;
  suggestToDeleteVariation: boolean;
  variationType: ConditionValueVariationType;
  setSuggestToDeleteVariation: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteVariationButton({
  index,
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
  variationType,
  suggestToDeleteVariation,
  setSuggestToDeleteVariation,
}: DeleteVariationButtonTypes) {
  const { removeConditionBlockVariation, getAmountOfConditionBlockVariations } = useConditionBlocks();
  const deleteVariationAsync = useDeleteConditionBlockVariation({
    conditionBlockVariationIdParams: conditionBlockVariationId,
  });

  const focusBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (suggestToDeleteVariation && focusBtn.current) {
      focusBtn.current?.focus();
    }
  }, [suggestToDeleteVariation]);

  return (
    <PlotfieldButton
      type="button"
      ref={focusBtn}
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
    >
      Удалить
    </PlotfieldButton>
  );
}
