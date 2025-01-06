import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../../../types/Additional/TranslationTypes";

type GetAllAchievementsTypes = {
  storyId: string;
  enabled?: boolean;
  language: CurrentlyAvailableLanguagesTypes;
};

export const fetchAllTranslationAchievements = async ({ language, storyId }: GetAllAchievementsTypes) => {
  return await axiosCustomized
    .get<TranslationAchievementTypes[]>(`/achievements/stories/${storyId}/translations?currentLanguage=${language}`)
    .then((r) => r.data);
};

export default function useGetAllTranslationAchievementByStoryId({
  storyId,
  language,
  enabled = !!storyId,
}: GetAllAchievementsTypes) {
  return useQuery({
    queryKey: ["story", storyId, "translation", language, "achievements"],
    queryFn: () => fetchAllTranslationAchievements({ language, storyId }),
    enabled,
  });
}
