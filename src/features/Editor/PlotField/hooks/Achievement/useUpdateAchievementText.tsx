import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldName } from "../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateAchievementTextTypes = {
  commandId: string;
  topologyBlockId: string;
  achievementName: string;
  storyId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateAchievementText({
  commandId,
  topologyBlockId,
  storyId,
  achievementName,
  language = "russian",
}: UpdateAchievementTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/achievements/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text: achievementName,
          storyId,
          textFieldName: TranslationTextFieldName.AchievementName,
        }
      ),
  });
}
