import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { AllAppearancePartRusVariations } from "@/const/APPEARACE_PARTS";
import { TranslationTextFieldNameAppearancePartsTypes } from "@/types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { AppearancePartVariationRusTypes } from "@/types/StoryData/AppearancePart/AppearancePartTypes";
import React from "react";
import { twMerge } from "tailwind-merge";

type StoryAttributesSelectAppearanceTypes = {
  setCurrentAppearanceType: React.Dispatch<React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes | "temp">>;
  currentAppearanceType: TranslationTextFieldNameAppearancePartsTypes | "temp";
  triggerClasses?: string;
  filterOrForm: "filter" | "form";
  defaultTrigger?: boolean;
};

export default function StoryAttributesSelectAppearanceType({
  setCurrentAppearanceType,
  currentAppearanceType,
  triggerClasses,
  filterOrForm,
  defaultTrigger = true,
}: StoryAttributesSelectAppearanceTypes) {
  const toRus: string =
    currentAppearanceType === "accessory"
      ? "украшение"
      : currentAppearanceType === "art"
      ? "татуировка"
      : currentAppearanceType === "body"
      ? "тело"
      : currentAppearanceType === "dress"
      ? "внешний вид"
      : currentAppearanceType === "hair"
      ? "волосы"
      : currentAppearanceType === "skin"
      ? "кожа"
      : currentAppearanceType === "temp"
      ? "остальное"
      : "Тип Одежды";

  const handleOnUpdateAppearance = (value: AppearancePartVariationRusTypes | "все") => {
    if (value === "все") {
      setCurrentAppearanceType("" as TranslationTextFieldNameAppearancePartsTypes | "temp");
      return;
    }
    const toEng: TranslationTextFieldNameAppearancePartsTypes | "temp" =
      value === "украшение"
        ? "accessory"
        : value === "татуировка"
        ? "art"
        : value === "тело"
        ? "body"
        : value === "внешний вид"
        ? "dress"
        : value === "волосы"
        ? "hair"
        : value === "кожа"
        ? "skin"
        : value === "остальное"
        ? "temp"
        : ("" as TranslationTextFieldNameAppearancePartsTypes | "temp");

    setCurrentAppearanceType(toEng);
  };

  return (
    <SelectWithBlur onValueChange={(pv) => handleOnUpdateAppearance(pv as AppearancePartVariationRusTypes)}>
      <SelectTrigger
        className={twMerge(
          `capitalize flex-grow ${
            defaultTrigger ? "md:text-[25px] text-heading" : "text-white text-[20px]"
          }  w-full relative border-border border-[1px] px-[10px] py-[5px]`,
          triggerClasses
        )}
      >
        <SelectValue placeholder={toRus} onBlur={(v) => v.currentTarget.blur()} />
      </SelectTrigger>
      <SelectContent>
        {AllAppearancePartRusVariations.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
        <SelectItem
          key={"все"}
          value={"все"}
          className={`${
            filterOrForm === "filter" && currentAppearanceType.trim().length ? "" : "hidden"
          } capitalize w-full`}
        >
          {"все"}
        </SelectItem>
      </SelectContent>
    </SelectWithBlur>
  );
}
