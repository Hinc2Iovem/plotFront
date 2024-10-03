import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationChoiceOptionTypes } from "../../../../../../../../types/Additional/TranslationTypes";
import { axiosCustomized } from "../../../../../../../../api/axios";

type GetCommandChoiceTypes = {
  choiceOptionId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetCommandChoiceOptionTranslation({
  choiceOptionId,
  language = "russian",
}: GetCommandChoiceTypes) {
  return useQuery({
    queryKey: ["translation", "choice", "option", choiceOptionId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationChoiceOptionTypes[]>(
          `/translations/plotFieldCommands/choices/options/${choiceOptionId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!choiceOptionId,
  });
}
