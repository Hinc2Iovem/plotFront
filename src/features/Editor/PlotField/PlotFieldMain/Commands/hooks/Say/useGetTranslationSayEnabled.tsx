import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSayTypes } from "../../../../../../../types/Additional/TranslationTypes";

type GetTranslationSayEnabledTypes = {
  commandId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationSayEnabled({
  commandId,
  language = "russian",
}: GetTranslationSayEnabledTypes) {
  return useQuery({
    queryKey: ["translation", "command", "say", commandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationSayTypes>(
          `/says/${commandId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId,
  });
}
