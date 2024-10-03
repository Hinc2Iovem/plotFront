import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameStoryTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateStoryTranslationTypes = {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateStoryTranslationOnMutationTypes = {
  textFieldName: TranslationTextFieldNameStoryTypes;
  text: string;
};

export default function useUpdateStoryTranslation({
  storyId,
  language,
}: UpdateStoryTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      textFieldName,
      text,
    }: UpdateStoryTranslationOnMutationTypes) =>
      await axiosCustomized.patch(`/stories/${storyId}/translations`, {
        currentLanguage: language,
        textFieldName,
        text,
      }),
  });
}
