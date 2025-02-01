import { useEffect, useRef, useState } from "react";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useCommandIf from "../../../Context/IfContext";
import useUpdateIfStatus from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfStatus";
import PlotfieldCharacterPromptMain from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";

type IfVariationStatusCharacterFieldTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;
  ifVariationId: string;
  plotfieldCommandId: string;
};

export default function IfVariationStatusCharacterField({
  characterValue,
  ifVariationId,
  plotfieldCommandId,
  setCharacterValue,
}: IfVariationStatusCharacterFieldTypes) {
  const [initCharacterValue, setInitCharacterValue] = useState<CharacterValueTypes>({
    _id: characterValue._id,
    characterName: characterValue.characterName,
    imgUrl: characterValue.imgUrl,
  });
  const { updateIfVariationValue } = useCommandIf();
  const preventRerender = useRef(false);

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  useEffect(() => {
    if (characterValue && preventRerender && characterValue._id !== initCharacterValue._id) {
      updateIfVariationValue({
        plotfieldCommandId,
        characterId: characterValue._id || "",
        ifVariationId,
      });

      if (typeof characterValue._id === "string") {
        setInitCharacterValue(characterValue);
        updateIfStatus.mutate({ characterId: characterValue._id });
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
      inputClasses="w-full h-fit md:text-[14px] text-[14px] text-text pr-[40px] border-none"
      containerClasses="border-border border-[3px] rounded-md h-fit"
    />
  );
}
