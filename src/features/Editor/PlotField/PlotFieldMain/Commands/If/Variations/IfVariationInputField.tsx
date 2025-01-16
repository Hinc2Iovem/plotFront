import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { IfVariationTypes, LogicalOperatorTypes } from "../Context/IfContext";
import DeleteVariationIf from "./DeleteVariationIf";
import LogicalOperatorIf from "./LogicalOperatorIf";
import IfVariationAppearance from "./VariationTypes/Appearance/IfVariationAppearance";
import IfVariationCharacter from "./VariationTypes/Character/IfVariationCharacter";
import IfVariationCharacteristic from "./VariationTypes/Characteristic/IfVariationCharacteristic";
import IfVariationKey from "./VariationTypes/Key/IfVariationKey";
import IfVariationLanguage from "./VariationTypes/Language/IfVariationLanguage";
import IfVariationRandom from "./VariationTypes/Random/IfVariationRandom";
import IfVariationRetry from "./VariationTypes/Retry/IfVariationRetry";
import IfVariationStatus from "./VariationTypes/Status/IfVariationStatus";
import { useState } from "react";

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
  const currentLogicalOperator = logicalOperators?.length - 1 >= index ? logicalOperators?.split(",")[index] : null;
  const [suggestDeletingVariation, setSuggestDeletingVariation] = useState(false);

  return (
    <ContextMenu modal={suggestDeletingVariation} onOpenChange={setSuggestDeletingVariation}>
      <ContextMenuTrigger className={`${insidePlotfield ? "hidden" : ""} flex gap-[5px] relative `}>
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
          <LogicalOperatorIf
            currentLogicalOperator={currentLogicalOperator as LogicalOperatorTypes}
            index={index}
            plotfieldCommandId={plotfieldCommandId}
            ifId={ifId}
          />
        ) : null}
      </ContextMenuTrigger>

      <DeleteVariationIf
        ifId={ifId}
        ifVariationId={ifVariationId}
        index={index}
        plotfieldCommandId={plotfieldCommandId}
        variationType={type}
        setSuggestDeletingVariation={setSuggestDeletingVariation}
      />
    </ContextMenu>
  );
}
