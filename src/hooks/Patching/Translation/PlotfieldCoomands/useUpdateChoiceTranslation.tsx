import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameChoiceTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateChoiceTranslationTypes = {
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateChoiceTranslationOnMutationTypes = {
  text?: string;
  textFieldName?: TranslationTextFieldNameChoiceTypes;
};

export default function useUpdateChoiceTranslation({
  topologyBlockId,
  commandId,
  language,
}: UpdateChoiceTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      text,
      textFieldName,
    }: UpdateChoiceTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/choices/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text,
          textFieldName,
        }
      ),
  });
}
