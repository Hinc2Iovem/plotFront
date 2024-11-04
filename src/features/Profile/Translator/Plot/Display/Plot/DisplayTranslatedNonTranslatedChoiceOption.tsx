import { useEffect, useState } from "react";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { ChoiceOptionTranslationsTypes } from "../../../../../../types/Additional/TranslationTypes";
import { ChoiceOptionVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useUpdateChoiceOptionTranslationText from "../../../../../Editor/PlotField/hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";

type DisplayTranslatedNonTranslatedChoiceOptionTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  currentType?: ChoiceOptionVariationsTypes;
  plotFieldCommandId?: string;
  providedChoiceOptionId: string;
  providedType: string;
  _id?: string;
  plotFieldCommandChoiceId?: string;
  choiceOptionId?: string;
  type?: ChoiceOptionVariationsTypes;
  language?: CurrentlyAvailableLanguagesTypes;
  translations?: ChoiceOptionTranslationsTypes[];
  updatedAt?: string;
  createdAt?: string;
};

export default function DisplayTranslatedNonTranslatedChoiceOption({
  currentLanguage,
  translations,
  choiceOptionId,
  type,
  providedType,
  plotFieldCommandId,
  providedChoiceOptionId,
}: DisplayTranslatedNonTranslatedChoiceOptionTypes) {
  const [initialOptionText, setInitialOptionText] = useState(
    (translations || [])[0]?.text || ""
  );
  const [optionText, setOptionText] = useState(
    (translations || [])[0]?.text || ""
  );

  useEffect(() => {
    if (translations) {
      setOptionText(translations[0]?.text || "");
      setInitialOptionText(translations[0]?.text || "");
    } else {
      setOptionText("");
      setInitialOptionText("");
    }
  }, [translations]);

  const debouncedOption = useDebounce({ value: optionText, delay: 500 });

  const updateChoiceOption = useUpdateChoiceOptionTranslationText({
    choiceOptionId: choiceOptionId || providedChoiceOptionId,
    option: debouncedOption,
    language: currentLanguage,
    type: type || (providedType as ChoiceOptionVariationsTypes),
    choiceId: plotFieldCommandId,
  });

  useEffect(() => {
    if (
      initialOptionText !== debouncedOption &&
      debouncedOption?.trim().length
    ) {
      updateChoiceOption.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedOption]);

  return (
    <input
      type="text"
      value={optionText}
      placeholder="Ответ"
      onChange={(e) => setOptionText(e.target.value)}
      className="w-1/2 flex-grow border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
    />
  );
}
