import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateAchievementTypes = {
  storyId: string;
  text?: string;
  achievementId?: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useCreateAchievement({ text, storyId, language, achievementId }: CreateAchievementTypes) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bodyAchievementId }: { bodyAchievementId?: string }) => {
      const currentAchievementId = bodyAchievementId?.trim().length ? bodyAchievementId : achievementId;
      await axiosCustomized.post(`/achievements/${currentAchievementId}/translations`, {
        storyId,
        currentLanguage: language,
        text,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["story", storyId, "translation", language, "achievements"],
        exact: true,
      });
    },
  });
}
