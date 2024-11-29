import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteCommandAchievementTypes = {
  commandAchievementId?: string;
};

export default function useDeleteCommandAchievement({ commandAchievementId }: DeleteCommandAchievementTypes) {
  return useMutation({
    mutationFn: async ({ commandAchievementBodyId }: { commandAchievementBodyId?: string }) => {
      const currentAchievementId = commandAchievementBodyId?.trim().length
        ? commandAchievementBodyId
        : commandAchievementId;
      await axiosCustomized.delete(`/plotFieldCommands/commandAchievements/${currentAchievementId}`);
    },
  });
}
