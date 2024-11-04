import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../../types/Additional/TranslationTypes";

type GetTranslationAchievementEnabledTypes = {
  commandId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationAchievementEnabled({
  commandId,
  language = "russian",
}: GetTranslationAchievementEnabledTypes) {
  return useQuery({
    queryKey: ["translation", language, "achievement", commandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAchievementTypes>(
          `/achievements/${commandId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId,
  });
}
