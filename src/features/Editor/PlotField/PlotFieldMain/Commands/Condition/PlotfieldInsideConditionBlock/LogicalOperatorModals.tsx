import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useConditionBlocks, {
  AllConditionValueVariationByLogicalOperatorIndexTypes,
  LogicalOperatorTypes,
} from "../Context/ConditionContext";
import useDeleteLogicalOperator from "../../../../hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useDeleteLogicalOperator";
import useDeleteConditionBlockVariation from "../../../../hooks/Condition/ConditionBlock/BlockVariations/useDeleteConditionBlockVariation";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import useUpdateLogicalOperator from "../../../../hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useUpdateLogicalOperator";

const AllLogicalOperators = ["&&", "||"];

type DeleteLogicalOperatorModalTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToDeleteLogicalOperator: boolean;
  setSuggestToDeleteLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
  allConditionBlockVariations: AllConditionValueVariationByLogicalOperatorIndexTypes[];
};

export function DeleteLogicalOperatorModal({
  index,
  conditionBlockId,
  plotfieldCommandId,
  allConditionBlockVariations,
  suggestToDeleteLogicalOperator,
  setSuggestToDeleteLogicalOperator,
}: DeleteLogicalOperatorModalTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef,
    setShowModal: setSuggestToDeleteLogicalOperator,
    showModal: suggestToDeleteLogicalOperator,
  });

  return (
    <aside
      ref={modalRef}
      className={`absolute ${
        suggestToDeleteLogicalOperator ? "" : "hidden"
      } right-0 z-[10] bg-primary-darker min-w-fit w-full rounded-md p-[.5rem] flex flex-col gap-[1rem] top-0 translate-y-[4rem]`}
    >
      <DeleteLogicalOperatorButton
        index={index}
        plotfieldCommandId={plotfieldCommandId}
        conditionBlockId={conditionBlockId}
        allConditionBlockVariations={allConditionBlockVariations}
        setSuggestToDeleteLogicalOperator={setSuggestToDeleteLogicalOperator}
      />
    </aside>
  );
}

type DeleteLogicalOperatorButtonTypes = {
  index: number;
  conditionBlockId: string;
  plotfieldCommandId: string;
  allConditionBlockVariations: AllConditionValueVariationByLogicalOperatorIndexTypes[];
  setSuggestToDeleteLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteLogicalOperatorButton({
  index,
  conditionBlockId,
  plotfieldCommandId,
  allConditionBlockVariations,
  setSuggestToDeleteLogicalOperator,
}: DeleteLogicalOperatorButtonTypes) {
  const { removeLogicalOperator, removeConditionBlockVariation } = useConditionBlocks();
  const deleteLogicalOperatorAsync = useDeleteLogicalOperator({ conditionBlockId });
  const deleteConditionValueVariationsAsync = useDeleteConditionBlockVariation({});

  return (
    <PlotfieldButton
      type="button"
      onClick={() => {
        setSuggestToDeleteLogicalOperator(false);
        removeLogicalOperator({ conditionBlockId, index, plotfieldCommandId });
        deleteLogicalOperatorAsync.mutate({ index });

        if (allConditionBlockVariations?.length > 0) {
          for (const variation of allConditionBlockVariations) {
            removeConditionBlockVariation({
              conditionBlockId,
              conditionBlockVariationId: variation.conditionBlockVariationId,
              plotfieldCommandId,
            });
            deleteConditionValueVariationsAsync.mutate({
              conditionBlockVariationIdBody: variation.conditionBlockVariationId,
              type: variation.type,
            });
          }
        }
      }}
    >
      Удалить
    </PlotfieldButton>
  );
}

type ChangeLogicalOperatorModalTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToChangeLogicalOperator: boolean;
  setSuggestToChangeLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ChangeLogicalOperatorModal({
  conditionBlockId,
  index,
  plotfieldCommandId,
  setSuggestToChangeLogicalOperator,
  suggestToChangeLogicalOperator,
}: ChangeLogicalOperatorModalTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef,
    setShowModal: setSuggestToChangeLogicalOperator,
    showModal: suggestToChangeLogicalOperator,
  });

  return (
    <aside
      ref={modalRef}
      className={`absolute ${
        suggestToChangeLogicalOperator ? "" : "hidden"
      } right-0 z-[10] bg-primary-darker min-w-fit rounded-md p-[.5rem] flex flex-col gap-[1rem] top-0 translate-y-[4rem]`}
    >
      {AllLogicalOperators.map((lo) => (
        <ChangeLogicalOperatorButton
          key={lo}
          value={lo as LogicalOperatorTypes}
          index={index}
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
          setSuggestToChangeLogicalOperator={setSuggestToChangeLogicalOperator}
        />
      ))}
    </aside>
  );
}

type ChangeLogicalOperatorButtonTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  value: LogicalOperatorTypes;
  setSuggestToChangeLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
};

function ChangeLogicalOperatorButton({
  index,
  value,
  conditionBlockId,
  plotfieldCommandId,
  setSuggestToChangeLogicalOperator,
}: ChangeLogicalOperatorButtonTypes) {
  const { updateLogicalOperator } = useConditionBlocks();
  const updateLogicalOperatorAsync = useUpdateLogicalOperator({ conditionBlockId });

  return (
    <PlotfieldButton
      type="button"
      onClick={() => {
        updateLogicalOperator({ conditionBlockId, index, logicalOperator: value, plotfieldCommandId });
        setSuggestToChangeLogicalOperator(false);
        updateLogicalOperatorAsync.mutate({ index, logicalOperator: value });
      }}
    >
      {value}
    </PlotfieldButton>
  );
}
