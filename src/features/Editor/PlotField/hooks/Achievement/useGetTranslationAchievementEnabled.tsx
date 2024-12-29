import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../../types/Additional/TranslationTypes";

type GetTranslationAchievementEnabledTypes = {
  achievementId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationAchievementEnabled({
  achievementId,
  language = "russian",
}: GetTranslationAchievementEnabledTypes) {
  return useQuery({
    queryKey: ["translation", language, "achievement", achievementId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAchievementTypes>(`/achievements/${achievementId}/translations?currentLanguage=${language}`)
        .then((r) => r.data),
    enabled: !!achievementId,
  });
}
