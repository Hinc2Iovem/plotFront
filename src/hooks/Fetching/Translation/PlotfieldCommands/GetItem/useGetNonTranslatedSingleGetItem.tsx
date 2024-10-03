import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationGetItemTypes } from "../../../../../types/Additional/TranslationTypes";

export default function useGetNonTranslatedSingleGetItem({
  commandId,
  language,
}: {
  commandId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      language,
      "plotFieldCommand",
      "getItem",
      commandId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationGetItemTypes>(
          `/getItems/${commandId}/translations/?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId && !!language,
  });
}
