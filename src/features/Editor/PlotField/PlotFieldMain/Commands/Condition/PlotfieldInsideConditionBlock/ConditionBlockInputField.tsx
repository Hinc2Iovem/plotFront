import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks, { ConditionBlockItemTypes, ConditionBlockVariationTypes } from "../Context/ConditionContext";
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
} & ConditionBlockItemTypes;

export default function ConditionBlockInputField({
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariations,
}: ConditionBlockInputFieldTypes) {
  const { getCurrentlyOpenConditionBlock } = useConditionBlocks();

  return (
    <div
      className={`${
        conditionBlockId === getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionBlockId ? "" : "hidden"
      }  flex flex-col gap-[.5rem]`}
    >
      {conditionBlockVariations.map((cbv) => (
        <ConditionBlockInputFieldItem
          key={cbv.conditionBlockVariationId}
          {...cbv}
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
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
}: ConditionBlockInputFieldItemTypes) {
  return (
    <>
      {type === "key" ? (
        <ConditionBlockVariationKey
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
          conditionBlockKeyId={commandKeyId || ""}
          conditionBlockVariationId={conditionBlockVariationId}
        />
      ) : type === "character" ? (
        <ConditionBlockVariationCharacter
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockCharacterId={conditionBlockVariationId}
          currentCharacterId={characterId || ""}
        />
      ) : type === "characteristic" ? (
        <ConditionBlockVariationCharacteristic
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockVariationId={conditionBlockVariationId}
          firstCharacteristicId={characteristicId || ""}
          secondCharacteristicId={secondCharacteristicId || ""}
          value={value || null}
        />
      ) : type === "appearance" ? (
        <ConditionBlockVariationAppearance
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockVariationId={conditionBlockVariationId}
          currentAppearancePartId={appearancePartId || ""}
        />
      ) : type === "random" ? (
        <ConditionBlockVariationRandom />
      ) : type === "retry" ? (
        <ConditionBlockVariationRetry
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          currentRentryAmount={amountOfRetries || null}
          plotfieldCommandId={plotfieldCommandId}
          currentSign={sign}
        />
      ) : type === "language" ? (
        <ConditionBlockVariationLanguage
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          currentLanguage={currentLanguage || null}
        />
      ) : type === "status" ? (
        <ConditionBlockVariationStatus
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          currentStatus={status || null}
          currentCharacterId={characterId || null}
        />
      ) : null}
    </>
  );
}
