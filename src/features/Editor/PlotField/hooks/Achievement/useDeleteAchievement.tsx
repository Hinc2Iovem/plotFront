import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteAchievementTypes = {
  achievementId?: string;
};

export default function useDeleteAchievement({ achievementId }: DeleteAchievementTypes) {
  return useMutation({
    mutationFn: async ({ bodyAchievementId }: { bodyAchievementId?: string }) => {
      const currentAchievementId = bodyAchievementId?.trim().length ? bodyAchievementId : achievementId;
      await axiosCustomized.delete(`/stories/achievements/${currentAchievementId}`);
    },
  });
}
