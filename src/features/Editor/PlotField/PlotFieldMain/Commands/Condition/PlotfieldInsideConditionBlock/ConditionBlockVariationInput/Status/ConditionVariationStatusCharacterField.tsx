import useUpdateConditionStatus from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionStatus";
import PlotfieldCharacterPromptMain from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useConditionBlocks from "../../../Context/ConditionContext";

type ConditionVariationStatusCharacterFieldTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;
  conditionBlockId: string;
  conditionBlockVariationId: string;
  plotfieldCommandId: string;
};

export default function ConditionVariationStatusCharacterField({
  conditionBlockVariationId,
  plotfieldCommandId,
  conditionBlockId,
  characterValue,
  setCharacterValue,
}: ConditionVariationStatusCharacterFieldTypes) {
  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const updateConditionStatus = useUpdateConditionStatus({ conditionBlockStatusId: conditionBlockVariationId });

  const handleOnBlur = (value: CharacterValueTypes) => {
    updateConditionBlockVariationValue({
      conditionBlockId,
      conditionBlockVariationId,
      plotfieldCommandId,
      characterId: value._id || "",
    });

    if (typeof value._id === "string") {
      setCharacterValue(value);
      updateConditionStatus.mutate({ characterId: value._id });
    }
  };

  return (
    <PlotfieldCharacterPromptMain
      imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
      inputClasses="w-full text-text pr-[40px] border-none"
      containerClasses="border-border border-[3px] rounded-md h-fit"
      initCharacterValue={characterValue}
      onBlur={handleOnBlur}
    />
  );
}
