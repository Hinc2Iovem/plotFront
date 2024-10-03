import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAchievementTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateAchievementTranslationTypes = {
  commandId: string;
  topologyBlockId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateAchievementTranslationOnMutationTypes = {
  text?: string;
  textFieldName?: TranslationTextFieldNameAchievementTypes;
};

export default function useUpdateAchievementTranslation({
  topologyBlockId,
  commandId,
  language,
  storyId,
}: UpdateAchievementTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      text,
      textFieldName,
    }: UpdateAchievementTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/achievements/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text,
          textFieldName,
          storyId,
        }
      ),
  });
}
