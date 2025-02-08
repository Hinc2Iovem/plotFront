import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useState } from "react";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import {
  ConditionBlockItemTypes,
  ConditionBlockVariationTypes,
  LogicalOperatorTypes,
} from "../Context/ConditionContext";
import useConditionBlocks from "../Context/ConditionContext";
import ConditionBlockVariationAppearance from "./ConditionBlockVariationInput/Appearance/ConditionBlockVariationAppearance";
import ConditionBlockVariationCharacter from "./ConditionBlockVariationInput/Character/ConditionBlockVariationCharacter";
import ConditionBlockVariationCharacteristic from "./ConditionBlockVariationInput/Characteristic/ConditionBlockVariationCharacteristic";
import ConditionBlockVariationKey from "./ConditionBlockVariationInput/Key/ConditionBlockVariationKey";
import ConditionBlockVariationLanguage from "./ConditionBlockVariationInput/Language/ConditionBlockVariationLanguage";
import ConditionBlockVariationRandom from "./ConditionBlockVariationInput/Random/ConditionBlockVariationRandom";
import ConditionBlockVariationRetry from "./ConditionBlockVariationInput/Retry/ConditionBlockVariationRetry";
import ConditionBlockVariationStatus from "./ConditionBlockVariationInput/Status/ConditionBlockVariationStatus";
import DeleteVariationCondition from "./DeleteVariation/DeleteVariationCondition";
import LogicalOperatorCondition from "./LogicalOperator/LogicalOperatorCondition";

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
  const getCurrentlyOpenConditionBlock = useConditionBlocks((store) => store.getCurrentlyOpenConditionBlock);

  return (
    <div
      className={`${
        conditionBlockId === getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionBlockId ? "" : "hidden"
      } ${insidePlotfield ? "" : ""} flex flex-col`}
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
  const currentLogicalOperator = logicalOperators?.length - 1 >= index ? logicalOperators?.split(",")[index] : null;

  const [suggestDeletingVariation, setSuggestDeletingVariation] = useState(false);

  return (
    <ContextMenu modal={suggestDeletingVariation} onOpenChange={setSuggestDeletingVariation}>
      <ContextMenuTrigger className={`${insidePlotfield ? "hidden" : ""} flex gap-[5px] relative `}>
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
          <LogicalOperatorCondition
            conditionBlockId={conditionBlockId}
            currentLogicalOperator={currentLogicalOperator as LogicalOperatorTypes}
            index={index}
            plotfieldCommandId={plotfieldCommandId}
          />
        ) : null}
      </ContextMenuTrigger>

      <DeleteVariationCondition
        conditionBlockId={conditionBlockId}
        conditionBlockVariationId={conditionBlockVariationId}
        index={index}
        plotfieldCommandId={plotfieldCommandId}
        setSuggestToDeleteVariation={setSuggestDeletingVariation}
        variationType={type}
      />
    </ContextMenu>
  );
}
