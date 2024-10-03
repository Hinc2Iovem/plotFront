import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { TranslationChoiceOptionTypes } from "../../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetTranslationChoiceOptionTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  optionId: string;
};

export default function useGetTranslationChoiceOption({
  language,
  optionId,
}: GetTranslationChoiceOptionTypes) {
  return useQuery({
    queryKey: ["translation", language, "choice", "option", optionId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationChoiceOptionTypes>(
          `/translations/plotFieldCommands/choices/option/${optionId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!optionId,
  });
}
