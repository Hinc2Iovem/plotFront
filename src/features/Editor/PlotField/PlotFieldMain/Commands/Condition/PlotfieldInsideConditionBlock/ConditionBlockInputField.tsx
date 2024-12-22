import { useState } from "react";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import useConditionBlocks, {
  AllConditionValueVariationByLogicalOperatorIndexTypes,
  ConditionBlockItemTypes,
  ConditionBlockVariationTypes,
} from "../Context/ConditionContext";
import ConditionBlockVariationAppearance from "./ConditionBlockVariationInput/Appearance/ConditionBlockVariationAppearance";
import ConditionBlockVariationCharacter from "./ConditionBlockVariationInput/Character/ConditionBlockVariationCharacter";
import ConditionBlockVariationCharacteristic from "./ConditionBlockVariationInput/Characteristic/ConditionBlockVariationCharacteristic";
import ConditionBlockVariationKey from "./ConditionBlockVariationInput/Key/ConditionBlockVariationKey";
import ConditionBlockVariationLanguage from "./ConditionBlockVariationInput/Language/ConditionBlockVariationLanguage";
import ConditionBlockVariationRandom from "./ConditionBlockVariationInput/Random/ConditionBlockVariationRandom";
import ConditionBlockVariationRetry from "./ConditionBlockVariationInput/Retry/ConditionBlockVariationRetry";
import ConditionBlockVariationStatus from "./ConditionBlockVariationInput/Status/ConditionBlockVariationStatus";
import DeleteVariationModal from "./DeleteVariationModal";
import { ChangeLogicalOperatorModal, DeleteLogicalOperatorModal } from "./LogicalOperatorModals";

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
