import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../../../api/axios";
import { TranslationSayTypes } from "../../../../../types/Additional/TranslationTypes";

type GetTranslationSayTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  commandId: string;
};

export default function useGetTranslationSay({
  commandId,
  language,
}: GetTranslationSayTypes) {
  return useQuery({
    queryKey: ["translation", language, "say", commandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationSayTypes>(
          `/says/${commandId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId && !!language,
  });
}
