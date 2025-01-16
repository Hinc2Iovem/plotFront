import { useEffect, useRef, useState } from "react";
import PlotfieldCharacterPromptMain from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useIfVariations from "../../../Context/IfContext";
import useUpdateIfCharacter from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfCharacter";

type IfVariationCharacterFieldTypes = {
  ifCharacterId: string;
  plotfieldCommandId: string;
  characterValue: CharacterValueTypes;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
};

export default function IfVariationCharacterField({
  characterValue,
  plotfieldCommandId,
  ifCharacterId,
  setCharacterValue,
}: IfVariationCharacterFieldTypes) {
  const { updateIfVariationValue } = useIfVariations();
  const [initCharacterValue, setInitCharacterValue] = useState<CharacterValueTypes>({
    _id: characterValue._id,
    characterName: characterValue.characterName,
    imgUrl: characterValue.imgUrl,
  });
  const preventRerender = useRef(false);

  const updateIf = useUpdateIfCharacter({
    ifCharacterId,
  });

  useEffect(() => {
    if (characterValue && preventRerender.current && initCharacterValue._id !== characterValue._id) {
      updateIfVariationValue({
        characterId: characterValue.characterName || "",
        plotfieldCommandId,
        ifVariationId: ifCharacterId,
      });

      setInitCharacterValue(characterValue);
      updateIf.mutate({
        characterId: characterValue._id || "",
      });
    }

    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  return (
    <div className="flex-grow min-w-[100px] relative">
      <PlotfieldCharacterPromptMain
        imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
        inputClasses="w-full text-[14px] md:text-[14px] text-text pr-[40px] h-fit border-none"
        containerClasses="border-border border-[3px] rounded-md"
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        setCharacterValue={setCharacterValue}
        characterValue={characterValue}
      />
    </div>
  );
}
