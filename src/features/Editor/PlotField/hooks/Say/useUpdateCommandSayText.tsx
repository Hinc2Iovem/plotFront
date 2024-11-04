import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldName } from "../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateCommandSayTextTypes = {
  commandId: string;
  textValue: string;
  topologyBlockId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateCommandSayText({
  commandId,
  textValue,
  topologyBlockId,
  language = "russian",
}: UpdateCommandSayTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/says/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          currentLanguage: language,
          text: textValue,
          textFieldName: TranslationTextFieldName.SayText,
        }
      ),
  });
}
