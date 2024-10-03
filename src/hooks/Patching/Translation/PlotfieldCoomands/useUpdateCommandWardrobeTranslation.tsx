import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameCommandWardrobeTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateCommandWardrobeTranslationTypes = {
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateCommandWardrobeTranslationOnMutationTypes = {
  text: string;
  textFieldName: TranslationTextFieldNameCommandWardrobeTypes;
};

export default function useUpdateCommandWardrobeTranslation({
  topologyBlockId,
  commandId,
  language,
}: UpdateCommandWardrobeTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      text,
      textFieldName,
    }: UpdateCommandWardrobeTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/commandWardrobes/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text,
          textFieldName,
        }
      ),
  });
}
