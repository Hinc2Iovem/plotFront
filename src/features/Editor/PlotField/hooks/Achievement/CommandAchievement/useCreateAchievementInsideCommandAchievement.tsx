import { CommandAchievementTypes } from "@/types/StoryEditor/PlotField/Achievement/AchievementTypes";
import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateAchievementInsideCommandAchievementTypes = {
  plotFieldCommandId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type CreateAchievementInsideCommandAchievementBodyTypes = {
  achievementId: string;
  storyId: string;
  text: string;
};

export default function useCreateAchievementInsideCommandAchievement({
  plotFieldCommandId,
  language = "russian",
}: CreateAchievementInsideCommandAchievementTypes) {
  return useMutation({
    mutationFn: async ({ achievementId, storyId, text }: CreateAchievementInsideCommandAchievementBodyTypes) =>
      await axiosCustomized
        .post<CommandAchievementTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/commandAchievements?currentLanguage=${language}`,
          {
            storyId,
            text,
            achievementId,
          }
        )
        .then((r) => r.data),
  });
}
