import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { useEffect, useState } from "react";
import {
  ChoiceVariations,
  ChoiceVariationsTypes,
} from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";

type ChoiceChooseVariationTypes = {
  choiceId: string;
  setChoiceVariationTypes: React.Dispatch<React.SetStateAction<ChoiceVariationsTypes>>;
  choiceVariationTypes: ChoiceVariationsTypes;
};

export default function ChoiceChooseVariationType({
  choiceId,
  choiceVariationTypes,
  setChoiceVariationTypes,
}: ChoiceChooseVariationTypes) {
  const [value, setValue] = useState(choiceVariationTypes ? choiceVariationTypes : "Тип Выбора");
  const updateChoice = useUpdateChoice({ choiceId });

  useEffect(() => {
    setValue(choiceVariationTypes);
  }, [choiceVariationTypes]);
  return (
    <SelectWithBlur
      onValueChange={(v: ChoiceVariationsTypes) => {
        setChoiceVariationTypes(v);
        setValue(v);
        if (v === "common") {
          updateChoice.mutate({ choiceType: "common" });
        }
      }}
    >
      <SelectTrigger className="min-w-[150px] w-auto bg-accent hover:bg-secondary focus-within:bg-secondary transition-all h-full capitalize flex-grow text-text relative">
        <SelectValue placeholder={value} onBlur={(v) => v.currentTarget.blur()} className={`text-[15px] w-full`} />
      </SelectTrigger>
      <SelectContent>
        {ChoiceVariations.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === value ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
