import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateGetItemTranslationTypes = {
  commandId: string;
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateGetItemTranslationOnMutationTypes = {
  text?: string;
  textFieldName: string;
};

export default function useUpdateGetItemTranslation({
  topologyBlockId,
  commandId,
  language,
}: UpdateGetItemTranslationTypes) {
  return useMutation({
    mutationFn: async ({ text, textFieldName }: UpdateGetItemTranslationOnMutationTypes) =>
      await axiosCustomized.patch(`/getItems/${commandId}/topologyBlocks/${topologyBlockId}/translations`, {
        currentLanguage: language,
        text,
        textFieldName,
      }),
  });
}
