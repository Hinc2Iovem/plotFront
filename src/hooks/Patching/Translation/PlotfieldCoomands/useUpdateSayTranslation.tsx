import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameSayTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateSayTranslationTypes = {
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateSayTranslationOnMutationTypes = {
  text: string;
  textFieldName: TranslationTextFieldNameSayTypes;
};

export default function useUpdateSayTranslation({
  topologyBlockId,
  commandId,
  language,
}: UpdateSayTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      text,
      textFieldName,
    }: UpdateSayTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/says/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text,
          textFieldName,
        }
      ),
  });
}
