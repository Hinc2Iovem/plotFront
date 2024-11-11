import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionCharacter from "../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import useUpdateConditionCharacteristic from "../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import useUpdateConditionRetry from "../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import useConditionBlocks, { ConditionBlockItemTypes } from "./Context/ConditionContext";
import { ConditionBlockInputFieldItem } from "./PlotfieldInsideConditionBlock/ConditionBlockInputField";

type ConditionValueItemTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
} & ConditionBlockItemTypes;

export default function ConditionValueItem({
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariations,
}: ConditionValueItemTypes) {
  return (
    <form
      className="w-full flex-grow flex flex-col gap-[1.5rem] bg-secondary rounded-md h-fit"
      onSubmit={(e) => e.preventDefault()}
    >
      {conditionBlockVariations.map((cbv) => (
        <ConditionBlockInputFieldItem
          key={cbv.conditionBlockVariationId}
          {...cbv}
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
        />
      ))}
    </form>
  );
}

type PlotfieldSingsPromptTypes = {
  setShowSignModal: React.Dispatch<React.SetStateAction<boolean>>;
  signName: ConditionSignTypes;
  conditionBlockId: string;
  plotfieldCommandId: string;
  type: ConditionValueVariationType;
  conditionBlockVariationId: string;
};

export function PlotfieldConditionSingsPrompt({
  setShowSignModal,
  signName,
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
  type,
}: PlotfieldSingsPromptTypes) {
  const { updateConditionBlockVariationSign } = useConditionBlocks();
  const updateValueCharacter = useUpdateConditionCharacter({ conditionBlockCharacterId: conditionBlockVariationId });
  const updateValueCharacteristic = useUpdateConditionCharacteristic({
    conditionBlockCharacteristicId: conditionBlockVariationId,
  });
  const updateValueRetry = useUpdateConditionRetry({ conditionBlockRetryId: conditionBlockVariationId });

  return (
    <AsideScrollableButton
      type="button"
      onClick={() => {
        if (type === "character") {
          updateValueCharacter.mutate({ sign: signName });
        } else if (type === "characteristic") {
          updateValueCharacteristic.mutate({ sign: signName });
        } else if (type === "retry") {
          updateValueRetry.mutate({ sign: signName });
        }
        updateConditionBlockVariationSign({
          conditionBlockId,
          sign: signName,
          conditionBlockVariationId,
          plotFieldCommandId: plotfieldCommandId,
        });
        setShowSignModal(false);
      }}
    >
      {signName}
    </AsideScrollableButton>
  );
}
