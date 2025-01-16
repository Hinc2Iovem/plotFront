import {
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import AsideScrollableButton from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useUpdateConditionCharacter from "../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import useUpdateConditionCharacteristic from "../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import useUpdateConditionRetry from "../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import useConditionBlocks, { ConditionBlockItemTypes } from "../Context/ConditionContext";
import { ConditionBlockInputFieldItem } from "../PlotfieldInsideConditionBlock/ConditionBlockInputField";

type ConditionValueItemTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  logicalOperators: string;
  topologyBlockId: string;
} & ConditionBlockItemTypes;

export default function ConditionValueItem({
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariations,
  logicalOperators,
  topologyBlockId,
}: ConditionValueItemTypes) {
  return (
    <form
      className="w-full flex-grow flex flex-col gap-[10px] bg-secondary rounded-md h-fit p-[10px]"
      onSubmit={(e) => e.preventDefault()}
    >
      {conditionBlockVariations.map((cbv, i) => (
        <ConditionBlockInputFieldItem
          key={cbv.conditionBlockVariationId}
          {...cbv}
          topologyBlockId={topologyBlockId}
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
          logicalOperators={logicalOperators}
          insidePlotfield={false}
          index={i}
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
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
};

export function PlotfieldConditionSingsPrompt({
  setShowSignModal,
  signName,
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
  type,
  setCurrentSign,
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
        setCurrentSign(signName);
        setShowSignModal(false);
      }}
    >
      {signName}
    </AsideScrollableButton>
  );
}
