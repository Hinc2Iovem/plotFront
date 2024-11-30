import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldButton from "../../../../../../shared/Buttons/PlotfieldButton";
import useDeleteLogicalOperator from "../../../../hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useDeleteLogicalOperator";
import useUpdateLogicalOperator from "../../../../hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useUpdateLogicalOperator";
import useDeleteConditionBlockVariation from "../../../../hooks/Condition/ConditionBlock/BlockVariations/useDeleteConditionBlockVariation";
import useConditionBlocks, {
  AllConditionValueVariationByLogicalOperatorIndexTypes,
  ConditionBlockItemTypes,
  ConditionBlockVariationTypes,
  LogicalOperatorTypes,
} from "../Context/ConditionContext";
import ConditionBlockVariationAppearance from "./ConditionBlockVariationInput/ConditionBlockVariationAppearance";
import ConditionBlockVariationCharacter from "./ConditionBlockVariationInput/ConditionBlockVariationCharacter";
import ConditionBlockVariationCharacteristic from "./ConditionBlockVariationInput/ConditionBlockVariationCharacteristic";
import ConditionBlockVariationKey from "./ConditionBlockVariationInput/ConditionBlockVariationKey";
import ConditionBlockVariationLanguage from "./ConditionBlockVariationInput/ConditionBlockVariationLanguage";
import ConditionBlockVariationRandom from "./ConditionBlockVariationInput/ConditionBlockVariationRandom";
import ConditionBlockVariationRetry from "./ConditionBlockVariationInput/ConditionBlockVariationRetry";
import ConditionBlockVariationStatus from "./ConditionBlockVariationInput/ConditionBlockVariationStatus";

type ConditionBlockInputFieldTypes = {
  plotfieldCommandId: string;
  logicalOperators: string;
  topologyBlockId: string;
  insidePlotfield?: boolean;
} & ConditionBlockItemTypes;

export default function ConditionBlockInputField({
  plotfieldCommandId,
  conditionBlockId,
  topologyBlockId,
  conditionBlockVariations,
  logicalOperators,
  insidePlotfield = false,
}: ConditionBlockInputFieldTypes) {
  const { getCurrentlyOpenConditionBlock } = useConditionBlocks();

  return (
    <div
      className={`${
        conditionBlockId === getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionBlockId ? "" : "hidden"
      } ${insidePlotfield ? "mt-[1rem]" : ""} flex flex-col gap-[.5rem]`}
    >
      {conditionBlockVariations.map((cbv, i) => (
        <ConditionBlockInputFieldItem
          key={cbv.conditionBlockVariationId}
          {...cbv}
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          logicalOperators={logicalOperators}
          insidePlotfield={insidePlotfield}
          topologyBlockId={topologyBlockId}
          index={i}
        />
      ))}

      <p className="bg-secondary rounded-md shadow-sm text-[1.3rem] text-text-light px-[1rem] py-[.5rem]">
        {getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.topologyBlockName}
      </p>
    </div>
  );
}

type ConditionBlockInputFieldItemTypes = {
  type: ConditionValueVariationType;
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  logicalOperators: string;
  insidePlotfield: boolean;
  topologyBlockId: string;
} & ConditionBlockVariationTypes;

const AllLogicalOperators = ["&&", "||"];

export function ConditionBlockInputFieldItem({
  type,
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariationId,
  amountOfRetries,
  appearancePartId,
  characterId,
  characteristicId,
  commandKeyId,
  currentLanguage,
  secondCharacteristicId,
  sign,
  status,
  value,
  logicalOperators,
  index,
  currentlyDressed,
  insidePlotfield,
  topologyBlockId,
}: ConditionBlockInputFieldItemTypes) {
  const { getAllConditionValueVariationByLogicalOperatorIndex } = useConditionBlocks();
  const [allConditionBlockVariations, setAllConditionBlockVariations] = useState<
    AllConditionValueVariationByLogicalOperatorIndexTypes[]
  >([]);
  const currentLogicalOperator = logicalOperators.length - 1 >= index ? logicalOperators?.split(",")[index] : null;

  const [suggestToChangeLogicalOperator, setSuggestToChangeLogicalOperator] = useState(false);
  const [suggestToDeleteLogicalOperator, setSuggestToDeleteLogicalOperator] = useState(false);

  const [suggestDeletingVariation, setSuggestDeletingVariation] = useState(false);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setSuggestDeletingVariation((prev) => !prev);
      }}
      className={`${insidePlotfield ? "hidden" : ""} flex gap-[.5rem] relative`}
    >
      {type === "key" ? (
        <ConditionBlockVariationKey
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          conditionBlockId={conditionBlockId}
          keyId={commandKeyId || ""}
          conditionBlockVariationId={conditionBlockVariationId}
        />
      ) : type === "character" ? (
        <ConditionBlockVariationCharacter
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          conditionBlockCharacterId={conditionBlockVariationId}
          currentCharacterId={characterId || ""}
        />
      ) : type === "characteristic" ? (
        <ConditionBlockVariationCharacteristic
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          firstCharacteristicId={characteristicId || ""}
          secondCharacteristicId={secondCharacteristicId || ""}
          value={value || null}
        />
      ) : type === "appearance" ? (
        <ConditionBlockVariationAppearance
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          currentAppearancePartId={appearancePartId || ""}
          currentlyDressed={currentlyDressed || false}
        />
      ) : type === "random" ? (
        <ConditionBlockVariationRandom />
      ) : type === "retry" ? (
        <ConditionBlockVariationRetry
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          currentRentryAmount={amountOfRetries || null}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          currentSign={sign}
        />
      ) : type === "language" ? (
        <ConditionBlockVariationLanguage
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          currentLanguage={currentLanguage || null}
        />
      ) : type === "status" ? (
        <ConditionBlockVariationStatus
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          currentStatus={status || null}
          currentCharacterId={characterId || null}
        />
      ) : null}

      {typeof currentLogicalOperator === "string" ? (
        <div className="relative w-[5rem]">
          <PlotfieldButton
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSuggestToDeleteLogicalOperator((prev) => !prev);
              setSuggestToChangeLogicalOperator(false);
              const allVariations = getAllConditionValueVariationByLogicalOperatorIndex({
                conditionBlockId,
                index,
                plotfieldCommandId,
              });
              setAllConditionBlockVariations(allVariations);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSuggestToChangeLogicalOperator((prev) => !prev);
              setSuggestToDeleteLogicalOperator(false);
            }}
            type="button"
            className="w-full bg-primary h-full"
          >
            {currentLogicalOperator}
          </PlotfieldButton>

          <DeleteLogicalOperatorModal
            conditionBlockId={conditionBlockId}
            index={index}
            plotfieldCommandId={plotfieldCommandId}
            setSuggestToDeleteLogicalOperator={setSuggestToDeleteLogicalOperator}
            suggestToDeleteLogicalOperator={suggestToDeleteLogicalOperator}
            allConditionBlockVariations={allConditionBlockVariations}
          />
          <ChangeLogicalOperatorModal
            conditionBlockId={conditionBlockId}
            index={index}
            plotfieldCommandId={plotfieldCommandId}
            setSuggestToChangeLogicalOperator={setSuggestToChangeLogicalOperator}
            suggestToChangeLogicalOperator={suggestToChangeLogicalOperator}
          />
        </div>
      ) : null}

      <DeleteVariationModal
        conditionBlockId={conditionBlockId}
        conditionBlockVariationId={conditionBlockVariationId}
        index={index}
        plotfieldCommandId={plotfieldCommandId}
        setSuggestToDeleteVariation={setSuggestDeletingVariation}
        suggestToDeleteVariation={suggestDeletingVariation}
        variationType={type}
      />
    </div>
  );
}

type DeleteVariationModalTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToDeleteVariation: boolean;
  setSuggestToDeleteVariation: React.Dispatch<React.SetStateAction<boolean>>;
  variationType: ConditionValueVariationType;
  conditionBlockVariationId: string;
};

function DeleteVariationModal({
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

type DeleteLogicalOperatorModalTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToDeleteLogicalOperator: boolean;
  setSuggestToDeleteLogicalOperator: React.Dispatch<React.SetStateAction<boolean>>;
  allConditionBlockVariations: AllConditionValueVariationByLogicalOperatorIndexTypes[];
};

function DeleteLogicalOperatorModal({
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

        if (allConditionBlockVariations.length > 0) {
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

function ChangeLogicalOperatorModal({
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
