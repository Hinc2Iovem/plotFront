import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldName } from "../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateWardrobeTextTypes = {
  commandId: string;
  title: string;
  topologyBlockId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateWardrobeTranslationText({
  commandId,
  title,
  topologyBlockId,
  language = "russian",
}: UpdateWardrobeTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/commandWardrobes/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text: title,
          textFieldName: TranslationTextFieldName.CommandWardrobeTitle,
        }
      ),
  });
}
