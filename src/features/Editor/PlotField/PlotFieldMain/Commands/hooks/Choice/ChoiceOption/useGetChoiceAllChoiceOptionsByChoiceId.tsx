import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationChoiceOptionTypes } from "../../../../../../../../types/Additional/TranslationTypes";

type GetChoiceTypes = {
  plotFieldCommandChoiceId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useGetAllChoiceOptionsByChoiceId({
  plotFieldCommandChoiceId,
  language,
}: GetChoiceTypes) {
  return useQuery({
    queryKey: [
      "choice",
      plotFieldCommandChoiceId,
      "translation",
      language,
      "option",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationChoiceOptionTypes[]>(
          `/choiceOptions/choices/${plotFieldCommandChoiceId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandChoiceId && !!language,
  });
}
