import { useEffect, useRef, useState } from "react";
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
  const [initCharacterValue, setInitCharacterValue] = useState<CharacterValueTypes>({
    _id: characterValue._id,
    characterName: characterValue.characterName,
    imgUrl: characterValue.imgUrl,
  });
  const preventRerender = useRef(false);

  const updateConditionBlock = useUpdateConditionCharacter({
    conditionBlockCharacterId,
  });

  useEffect(() => {
    if (characterValue && preventRerender.current && initCharacterValue._id !== characterValue._id) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        characterId: characterValue.characterName || "",
        plotfieldCommandId,
        conditionBlockVariationId: conditionBlockCharacterId,
      });

      setInitCharacterValue(characterValue);
      updateConditionBlock.mutate({
        characterId: characterValue._id || "",
      });
    }

    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  return (
    <div className="flex-grow min-w-[10rem] relative">
      <PlotfieldCharacterPromptMain
        imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
        inputClasses="w-full text-text pr-[40px] border-none"
        containerClasses="border-border border-[3px] rounded-md h-fit"
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        setCharacterValue={setCharacterValue}
        characterValue={characterValue}
      />
    </div>
  );
}
