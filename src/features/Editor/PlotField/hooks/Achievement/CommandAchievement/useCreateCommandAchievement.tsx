import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateCommandAchievementTypes = {
  storyId: string;
  text?: string;
  achievementId?: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export type CreateCommandAchievementOnMutationTypes = {
  achievementId?: string;
  plotfieldCommandId?: string;
  createNewAchievement?: boolean;
};

export default function useCreateCommandAchievement({ text, storyId, language }: CreateCommandAchievementTypes) {
  return useMutation({
    mutationFn: async ({
      achievementId,
      createNewAchievement = false,
      plotfieldCommandId,
    }: CreateCommandAchievementOnMutationTypes) => {
      await axiosCustomized.post(`/plotFieldCommands/commandAchievements`, {
        storyId,
        currentLanguage: language,
        text,
        createNewAchievement,
        achievementId,
        plotfieldCommandId,
      });
    },
  });
}
