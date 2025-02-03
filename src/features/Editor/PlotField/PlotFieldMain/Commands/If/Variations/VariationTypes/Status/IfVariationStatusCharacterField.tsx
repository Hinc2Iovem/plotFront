import useUpdateIfStatus from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfStatus";
import PlotfieldCharacterPromptMain from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useCommandIf from "../../../Context/IfContext";

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
  const { updateIfVariationValue } = useCommandIf();

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  const handleOnBlur = (value: CharacterValueTypes) => {
    updateIfVariationValue({
      plotfieldCommandId,
      characterId: value._id || "",
      ifVariationId,
    });

    if (typeof value._id === "string") {
      setCharacterValue(value);
      updateIfStatus.mutate({ characterId: value._id });
    }
  };

  return (
    <PlotfieldCharacterPromptMain
      imgClasses="w-[30px] absolute top-1/2 -translate-y-1/2 right-[2.5px]"
      inputClasses="w-full h-fit md:text-[14px] text-[14px] text-text pr-[40px] border-none"
      containerClasses="border-border border-[3px] rounded-md h-fit"
      initCharacterValue={characterValue}
      onBlur={handleOnBlur}
    />
  );
}
