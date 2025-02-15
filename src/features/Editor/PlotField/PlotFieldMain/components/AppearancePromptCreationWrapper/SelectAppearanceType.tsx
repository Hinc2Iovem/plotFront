import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { AllAppearancePartRusVariations } from "@/const/APPEARACE_PARTS";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartVariationRusTypes } from "@/types/StoryData/AppearancePart/AppearancePartTypes";
import { useState } from "react";

type SelectAppearanceTypeProps = {
  setAppearanceType: React.Dispatch<React.SetStateAction<"temp" | TranslationTextFieldNameAppearancePartsTypes>>;
};

export default function SelectAppearanceType({ setAppearanceType }: SelectAppearanceTypeProps) {
  const [appearanceTypeRus, setAppearanceTypeRus] = useState<AppearancePartVariationRusTypes>("остальное");

  return (
    <SelectWithBlur
      onValueChange={(v: AppearancePartVariationRusTypes) => {
        setAppearanceTypeRus(v);
        const toEng: "temp" | TranslationTextFieldNameAppearancePartsTypes =
          v === "внешний вид"
            ? "dress"
            : v === "волосы"
            ? "hair"
            : v === "кожа"
            ? "skin"
            : v === "остальное"
            ? "temp"
            : v === "татуировка"
            ? "art"
            : v === "тело"
            ? "body"
            : "accessory";
        setAppearanceType(toEng);
      }}
    >
      <SelectTrigger className={`capitalize w-full text-text`}>
        <SelectValue
          placeholder={appearanceTypeRus}
          onBlur={(v) => v.currentTarget.blur()}
          className={`capitalize text-text text-[25px]`}
        />
      </SelectTrigger>
      <SelectContent>
        {AllAppearancePartRusVariations.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === appearanceTypeRus ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
