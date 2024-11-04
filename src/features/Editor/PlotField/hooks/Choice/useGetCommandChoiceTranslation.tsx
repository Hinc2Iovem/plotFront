import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationChoiceTypes } from "../../../../../types/Additional/TranslationTypes";

type GetCommandChoiceTypes = {
  commandId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetCommandChoiceTranslation({
  commandId,
  language = "russian",
}: GetCommandChoiceTypes) {
  return useQuery({
    queryKey: ["translation", language, "choice", commandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationChoiceTypes>(
          `/choices/${commandId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId,
  });
}
