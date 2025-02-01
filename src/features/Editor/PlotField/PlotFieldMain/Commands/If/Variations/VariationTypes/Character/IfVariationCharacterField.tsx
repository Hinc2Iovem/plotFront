import useUpdateIfCharacter from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfCharacter";
import PlotfieldCharacterPromptMain from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useCommandIf from "../../../Context/IfContext";

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
  const { updateIfVariationValue } = useCommandIf();

  const updateIf = useUpdateIfCharacter({
    ifCharacterId,
  });

  const handleOnBlur = (value: CharacterValueTypes) => {
    updateIfVariationValue({
      characterId: value._id || "",
      plotfieldCommandId,
      ifVariationId: ifCharacterId,
    });

    setCharacterValue(value);
    updateIf.mutate({
      characterId: value._id || "",
    });
  };

  return (
    <div className="flex-grow min-w-[100px] relative">
      <PlotfieldCharacterPromptMain
        imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
        inputClasses="w-full text-[14px] md:text-[14px] text-text pr-[40px] h-fit border-none"
        containerClasses="border-border border-[3px] rounded-md"
        initCharacterValue={characterValue}
        onBlur={handleOnBlur}
      />
    </div>
  );
}
