import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { ALL_LANGUAGES, CurrentlyAvailableLanguagesTypes } from "@/types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import React from "react";

type SelectLanguageTypes = {
  onValueChange?: (v: CurrentlyAvailableLanguagesTypes) => void;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  setCurrentLanguage: React.Dispatch<React.SetStateAction<CurrentlyAvailableLanguagesTypes>>;
};

export default function SelectLanguage({ currentLanguage, setCurrentLanguage, onValueChange }: SelectLanguageTypes) {
  return (
    <SelectWithBlur
      onValueChange={(v) => {
        setCurrentLanguage(v as CurrentlyAvailableLanguagesTypes);
        if (onValueChange) {
          onValueChange(v as CurrentlyAvailableLanguagesTypes);
        }
      }}
    >
      <SelectTrigger className="capitalize flex-grow border-border border-[3px] w-full text-text relative">
        <SelectValue
          placeholder={currentLanguage.trim().length ? currentLanguage : "Язык"}
          onBlur={(v) => v.currentTarget.blur()}
          className={`text-text text-[20px] py-[20px] bg-accent hover:opacity-80 active:scale-[.99] transition-all`}
        />
      </SelectTrigger>
      <SelectContent>
        {ALL_LANGUAGES.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === currentLanguage ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
