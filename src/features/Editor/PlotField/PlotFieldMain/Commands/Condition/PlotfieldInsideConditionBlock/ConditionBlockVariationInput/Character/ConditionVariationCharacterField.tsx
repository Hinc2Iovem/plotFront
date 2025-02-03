import useUpdateConditionCharacter from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import PlotfieldCharacterPromptMain from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useConditionBlocks from "../../../Context/ConditionContext";

type ConditionVariationCharacterFieldTypes = {
  conditionBlockCharacterId: string;
  plotfieldCommandId: string;
  conditionBlockId: string;
  characterValue: CharacterValueTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
};

export default function ConditionVariationCharacterField({
  characterValue,
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockCharacterId,
  setCharacterValue,
}: ConditionVariationCharacterFieldTypes) {
  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const updateConditionBlock = useUpdateConditionCharacter({
    conditionBlockCharacterId,
  });

  const handleOnBlur = (value: CharacterValueTypes) => {
    updateConditionBlockVariationValue({
      conditionBlockId,
      characterId: value.characterName || "",
      plotfieldCommandId,
      conditionBlockVariationId: conditionBlockCharacterId,
    });

    setCharacterValue(value);
    updateConditionBlock.mutate({
      characterId: value._id || "",
    });
  };

  return (
    <div className="flex-grow min-w-[10rem] relative">
      <PlotfieldCharacterPromptMain
        imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
        inputClasses="w-full text-text pr-[40px] border-none"
        containerClasses="border-border border-[3px] rounded-md h-fit"
        initCharacterValue={characterValue}
        onBlur={handleOnBlur}
      />
    </div>
  );
}
