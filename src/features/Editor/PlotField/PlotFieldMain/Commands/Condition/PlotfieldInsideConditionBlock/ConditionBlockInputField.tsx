import { ConditionValueVariationType } from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../Context/ConditionContext";
import ConditionBlockVariationAppearance from "./ConditionBlockVariationInput/ConditionBlockVariationAppearance";
import ConditionBlockVariationCharacter from "./ConditionBlockVariationInput/ConditionBlockVariationCharacter";
import ConditionBlockVariationCharacteristic from "./ConditionBlockVariationInput/ConditionBlockVariationCharacteristic";
import ConditionBlockVariationKey from "./ConditionBlockVariationInput/ConditionBlockVariationKey";

type ConditionBlockInputFieldTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionType: ConditionValueVariationType;
};

export default function ConditionBlockInputField({
  conditionType,
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockInputFieldTypes) {
  const { getCurrentlyOpenConditionBlock } = useConditionBlocks();

  return (
    <div
      className={`${
        conditionBlockId ===
        getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.conditionBlockId
          ? ""
          : "hidden"
      }  flex flex-col gap-[.5rem]`}
    >
      {conditionType === "key" ? (
        <ConditionBlockVariationKey
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
        />
      ) : conditionType === "character" ? (
        <ConditionBlockVariationCharacter
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />
      ) : conditionType === "characteristic" ? (
        <ConditionBlockVariationCharacteristic
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />
      ) : conditionType === "appearance" ? (
        <ConditionBlockVariationAppearance
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />
      ) : null}

      <p className="bg-secondary rounded-md shadow-sm text-[1.3rem] text-text-light px-[1rem] py-[.5rem]">
        {
          getCurrentlyOpenConditionBlock({ plotfieldCommandId })
            ?.topologyBlockName
        }
      </p>
    </div>
  );
}
