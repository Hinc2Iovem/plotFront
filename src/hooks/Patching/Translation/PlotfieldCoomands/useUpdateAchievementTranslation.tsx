import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAchievementTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateAchievementTranslationTypes = {
  achievementId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateAchievementTranslationOnMutationTypes = {
  text?: string;
  textFieldName?: TranslationTextFieldNameAchievementTypes;
};

export default function useUpdateAchievementTranslation({
  achievementId,
  language,
  storyId,
}: UpdateAchievementTranslationTypes) {
  return useMutation({
    mutationFn: async ({ text, textFieldName }: UpdateAchievementTranslationOnMutationTypes) =>
      await axiosCustomized.patch(`/achievements/${achievementId}/translations`, {
        currentLanguage: language,
        text,
        textFieldName,
        storyId,
      }),
  });
}
