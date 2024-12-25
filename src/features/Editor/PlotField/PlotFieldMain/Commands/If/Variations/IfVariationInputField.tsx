import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import useDeleteIfVariation from "../../../../hooks/If/BlockVariations/useDeleteIfVariation";
import useIfVariations, {
  AllIfValueVariationByLogicalOperatorIndexTypes,
  IfVariationTypes,
} from "../Context/IfContext";
import IfVariationAppearance from "./VariationTypes/Appearance/IfVariationAppearance";
import IfVariationCharacter from "./VariationTypes/Character/IfVariationCharacter";
import IfVariationCharacteristic from "./VariationTypes/Characteristic/IfVariationCharacteristic";
import IfVariationKey from "./VariationTypes/Key/IfVariationKey";
import IfVariationLanguage from "./VariationTypes/Language/IfVariationLanguage";
import IfVariationRandom from "./VariationTypes/Random/IfVariationRandom";
import IfVariationRetry from "./VariationTypes/Retry/IfVariationRetry";
import IfVariationStatus from "./VariationTypes/Status/IfVariationStatus";
import { ChangeLogicalOperatorModal, DeleteLogicalOperatorModal } from "./LogicalOperationModals";

type IfInputFieldItemTypes = {
  type: ConditionValueVariationType;
  ifId: string;
  plotfieldCommandId: string;
  index: number;
  logicalOperators: string;
  insidePlotfield: boolean;
  topologyBlockId: string;
} & IfVariationTypes;

export function IfVariationInputField({
  type,
  plotfieldCommandId,
  ifId,
  ifVariationId,
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
}: IfInputFieldItemTypes) {
  const { getAllIfValueVariationByLogicalOperatorIndex } = useIfVariations();
  const [allIfVariations, setAllIfVariations] = useState<AllIfValueVariationByLogicalOperatorIndexTypes[]>([]);
  const currentLogicalOperator = logicalOperators?.length - 1 >= index ? logicalOperators?.split(",")[index] : null;

  const [suggestToChangeLogicalOperator, setSuggestToChangeLogicalOperator] = useState(false);
  const [suggestToDeleteLogicalOperator, setSuggestToDeleteLogicalOperator] = useState(false);

  const [suggestDeletingVariation, setSuggestDeletingVariation] = useState(false);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        setSuggestDeletingVariation((prev) => !prev);
      }}
      className={`${
        insidePlotfield ? "hidden" : ""
      } flex gap-[1rem] relative min-w-[45rem] flex-grow p-[.3rem] rounded-md`}
    >
      {type === "key" ? (
        <IfVariationKey
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          keyId={commandKeyId || ""}
          ifVariationId={ifVariationId}
        />
      ) : type === "character" ? (
        <IfVariationCharacter
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          ifCharacterId={ifVariationId}
          currentCharacterId={characterId || ""}
        />
      ) : type === "characteristic" ? (
        <IfVariationCharacteristic
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          ifVariationId={ifVariationId}
          firstCharacteristicId={characteristicId || ""}
          secondCharacteristicId={secondCharacteristicId || ""}
          value={value || null}
        />
      ) : type === "appearance" ? (
        <IfVariationAppearance
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          ifVariationId={ifVariationId}
          currentAppearancePartId={appearancePartId || ""}
          currentlyDressed={currentlyDressed || false}
        />
      ) : type === "random" ? (
        <IfVariationRandom />
      ) : type === "retry" ? (
        <IfVariationRetry
          ifVariationId={ifVariationId}
          currentRentryAmount={amountOfRetries || null}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          currentSign={sign}
        />
      ) : type === "language" ? (
        <IfVariationLanguage
          ifVariationId={ifVariationId}
          plotfieldCommandId={plotfieldCommandId}
          topologyBlockId={topologyBlockId}
          currentLanguage={currentLanguage || null}
        />
      ) : type === "status" ? (
        <IfVariationStatus
          ifVariationId={ifVariationId}
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
              const allVariations = getAllIfValueVariationByLogicalOperatorIndex({
                index,
                plotfieldCommandId,
              });
              setAllIfVariations(allVariations);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSuggestToChangeLogicalOperator((prev) => !prev);
              setSuggestToDeleteLogicalOperator(false);
            }}
            type="button"
            className="w-full bg-secondary h-full"
          >
            {currentLogicalOperator}
          </PlotfieldButton>

          <DeleteLogicalOperatorModal
            ifId={ifId}
            index={index}
            plotfieldCommandId={plotfieldCommandId}
            setSuggestToDeleteLogicalOperator={setSuggestToDeleteLogicalOperator}
            suggestToDeleteLogicalOperator={suggestToDeleteLogicalOperator}
            allIfVariations={allIfVariations}
          />
          <ChangeLogicalOperatorModal
            ifId={ifId}
            index={index}
            plotfieldCommandId={plotfieldCommandId}
            setSuggestToChangeLogicalOperator={setSuggestToChangeLogicalOperator}
            suggestToChangeLogicalOperator={suggestToChangeLogicalOperator}
          />
        </div>
      ) : null}

      <DeleteVariationModal
        ifId={ifId}
        ifVariationId={ifVariationId}
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
  ifId: string;
  plotfieldCommandId: string;
  index: number;
  suggestToDeleteVariation: boolean;
  setSuggestToDeleteVariation: React.Dispatch<React.SetStateAction<boolean>>;
  variationType: ConditionValueVariationType;
  ifVariationId: string;
};

function DeleteVariationModal({
  index,
  ifId,
  plotfieldCommandId,
  variationType,
  suggestToDeleteVariation,
  ifVariationId,
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
        ifId={ifId}
        variationType={variationType}
        suggestToDeleteVariation={suggestToDeleteVariation}
        ifVariationId={ifVariationId}
        setSuggestToDeleteVariation={setSuggestToDeleteVariation}
      />
    </aside>
  );
}

type DeleteVariationButtonTypes = {
  index: number;
  ifId: string;
  plotfieldCommandId: string;
  ifVariationId: string;
  suggestToDeleteVariation: boolean;
  variationType: ConditionValueVariationType;
  setSuggestToDeleteVariation: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteVariationButton({
  index,
  ifId,
  plotfieldCommandId,
  ifVariationId,
  variationType,
  suggestToDeleteVariation,
  setSuggestToDeleteVariation,
}: DeleteVariationButtonTypes) {
  const { removeIfVariation, getAmountOfIfVariations } = useIfVariations();
  const deleteVariationAsync = useDeleteIfVariation({
    ifVariationIdParams: ifVariationId,
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
          index > 0 && getAmountOfIfVariations({ plotfieldCommandId }) - 1 === index ? index - 1 : index;

        removeIfVariation({
          ifVariationId,
          plotfieldCommandId,
          index: currentIndex,
        });
        // currentIndex will allow to remove logicalOperator of a previous variation, when there are no other variation to replace current one to be compared with the logicalOperator of the previous variation

        deleteVariationAsync.mutate({ type: variationType, ifId, index: currentIndex });
      }}
    >
      Удалить
    </PlotfieldButton>
  );
}
