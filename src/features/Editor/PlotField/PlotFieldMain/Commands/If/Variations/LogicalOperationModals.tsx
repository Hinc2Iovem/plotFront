import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useIfVariations, {
  AllIfValueVariationByLogicalOperatorIndexTypes,
  LogicalOperatorTypes,
} from "../Context/IfContext";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import useDeleteLogicalOperator from "../../../../hooks/If/BlockVariations/logicalOperator/useDeleteLogicalOperator";
import useDeleteIfVariation from "../../../../hooks/If/BlockVariations/useDeleteIfVariation";
import useUpdateLogicalOperator from "../../../../hooks/If/BlockVariations/logicalOperator/useUpdateLogicalOperator";

const AllLogicalOperators = ["&&", "||"];

type DeleteLogicalOperatorModalTypes = {
  ifId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToDeleteLogicalOperator: boolean;
  setSuggestToDeleteLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
  allIfVariations: AllIfValueVariationByLogicalOperatorIndexTypes[];
};

export function DeleteLogicalOperatorModal({
  index,
  ifId,
  plotfieldCommandId,
  allIfVariations,
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
        ifId={ifId}
        allIfVariations={allIfVariations}
        setSuggestToDeleteLogicalOperator={setSuggestToDeleteLogicalOperator}
      />
    </aside>
  );
}

type DeleteLogicalOperatorButtonTypes = {
  index: number;
  ifId: string;
  plotfieldCommandId: string;
  allIfVariations: AllIfValueVariationByLogicalOperatorIndexTypes[];
  setSuggestToDeleteLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteLogicalOperatorButton({
  index,
  ifId,
  plotfieldCommandId,
  allIfVariations,
  setSuggestToDeleteLogicalOperator,
}: DeleteLogicalOperatorButtonTypes) {
  const { removeLogicalOperator, removeIfVariation } = useIfVariations();
  const deleteLogicalOperatorAsync = useDeleteLogicalOperator({ ifId });
  const deleteIfValueVariationsAsync = useDeleteIfVariation({});

  return (
    <PlotfieldButton
      type="button"
      onClick={() => {
        setSuggestToDeleteLogicalOperator(false);
        removeLogicalOperator({ index, plotfieldCommandId });
        deleteLogicalOperatorAsync.mutate({ index });

        if (allIfVariations?.length > 0) {
          for (const variation of allIfVariations) {
            removeIfVariation({
              ifVariationId: variation.ifVariationId,
              plotfieldCommandId,
            });
            deleteIfValueVariationsAsync.mutate({
              ifVariationIdBody: variation.ifVariationId,
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
  ifId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToChangeLogicalOperator: boolean;
  setSuggestToChangeLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ChangeLogicalOperatorModal({
  ifId,
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
          ifId={ifId}
          setSuggestToChangeLogicalOperator={setSuggestToChangeLogicalOperator}
        />
      ))}
    </aside>
  );
}

type ChangeLogicalOperatorButtonTypes = {
  ifId: string;
  plotfieldCommandId: string;
  index: number;
  value: LogicalOperatorTypes;
  setSuggestToChangeLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
};

function ChangeLogicalOperatorButton({
  index,
  value,
  ifId,
  plotfieldCommandId,
  setSuggestToChangeLogicalOperator,
}: ChangeLogicalOperatorButtonTypes) {
  const { updateLogicalOperator } = useIfVariations();
  const updateLogicalOperatorAsync = useUpdateLogicalOperator({ ifId });

  return (
    <PlotfieldButton
      type="button"
      onClick={() => {
        updateLogicalOperator({ index, logicalOperator: value, plotfieldCommandId });
        setSuggestToChangeLogicalOperator(false);
        updateLogicalOperatorAsync.mutate({ index, logicalOperator: value });
      }}
    >
      {value}
    </PlotfieldButton>
  );
}
