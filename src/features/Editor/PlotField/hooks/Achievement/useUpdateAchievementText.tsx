import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldName } from "../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateAchievementTextTypes = {
  achievementId: string;
  achievementName: string;
  storyId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateAchievementText({
  achievementId,
  storyId,
  achievementName,
  language = "russian",
}: UpdateAchievementTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(`/achievements/${achievementId}/translations`, {
        currentLanguage: language,
        text: achievementName,
        storyId,
        textFieldName: TranslationTextFieldName.AchievementName,
      }),
  });
}
