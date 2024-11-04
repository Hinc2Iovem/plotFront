import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionValue from "../../../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useConditionBlocks from "./Context/ConditionContext";
import ConditionBlockVariationAppearance from "./PlotfieldInsideConditionBlock/ConditionBlockVariationInput/ConditionBlockVariationAppearance";
import ConditionBlockVariationCharacter from "./PlotfieldInsideConditionBlock/ConditionBlockVariationInput/ConditionBlockVariationCharacter";
import ConditionBlockVariationCharacteristic from "./PlotfieldInsideConditionBlock/ConditionBlockVariationInput/ConditionBlockVariationCharacteristic";
import ConditionBlockVariationKey from "./PlotfieldInsideConditionBlock/ConditionBlockVariationInput/ConditionBlockVariationKey";

type ConditionValueItemTypes = {
  conditionBlockId: string;
  name: string | undefined;
  sign: ConditionSignTypes | undefined;
  value: string | null | undefined;
  plotfieldCommandId: string;
  conditionType: ConditionValueVariationType;
};

export default function ConditionValueItem({
  conditionBlockId,
  conditionType,
  plotfieldCommandId,
}: ConditionValueItemTypes) {
  return (
    <form
      className="w-full flex-grow flex flex-col gap-[1rem] bg-secondary rounded-md h-fit"
      onSubmit={(e) => e.preventDefault()}
    >
      {conditionType === "key" ? (
        <ConditionBlockVariationKey
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
        />
      ) : conditionType === "appearance" ? (
        <ConditionBlockVariationAppearance
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
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
      ) : null}
    </form>
  );
}

type PlotfieldSingsPromptTypes = {
  setShowSignModal: React.Dispatch<React.SetStateAction<boolean>>;
  signName: ConditionSignTypes;
  conditionBlockId: string;
  plotfieldCommandId: string;
};

export function PlotfieldConditionSingsPrompt({
  setShowSignModal,
  signName,
  conditionBlockId,
  plotfieldCommandId,
}: PlotfieldSingsPromptTypes) {
  const { updateConditionBlockSign } = useConditionBlocks();
  const updateValue = useUpdateConditionValue({ conditionBlockId });

  return (
    <AsideScrollableButton
      type="button"
      onClick={() => {
        updateConditionBlockSign({
          conditionBlockId,
          plotfieldCommandId,
          sign: signName,
        });
        setShowSignModal(false);
        updateValue.mutate({ sign: signName });
      }}
    >
      {signName}
    </AsideScrollableButton>
  );
}
