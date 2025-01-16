import { useEffect, useRef, useState } from "react";
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
  const [initCharacterValue, setInitCharacterValue] = useState<CharacterValueTypes>({
    _id: characterValue._id,
    characterName: characterValue.characterName,
    imgUrl: characterValue.imgUrl,
  });
  const { updateConditionBlockVariationValue } = useConditionBlocks();
  const preventRerender = useRef(false);

  const updateConditionStatus = useUpdateConditionStatus({ conditionBlockStatusId: conditionBlockVariationId });

  useEffect(() => {
    if (characterValue && preventRerender && characterValue._id !== initCharacterValue._id) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        conditionBlockVariationId,
        plotfieldCommandId,
        characterId: characterValue._id || "",
      });

      if (typeof characterValue._id === "string") {
        setInitCharacterValue(characterValue);
        updateConditionStatus.mutate({ characterId: characterValue._id });
      }
    }
    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  return (
    <PlotfieldCharacterPromptMain
      characterName={characterValue.characterName || ""}
      currentCharacterId={characterValue._id || ""}
      setCharacterValue={setCharacterValue}
      characterValue={characterValue}
      imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
      inputClasses="w-full text-text pr-[40px] border-none"
      containerClasses="border-border border-[3px] rounded-md h-fit"
    />
  );
}
