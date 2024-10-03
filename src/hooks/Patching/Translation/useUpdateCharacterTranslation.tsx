import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateCharacterTranslationTypes = {
  characterId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateCharacterTranslationOnMutationTypes = {
  textFieldName?: string;
  debouncedValue?: string;
};

export default function useUpdateCharacterTranslation({
  characterId,
  language,
}: UpdateCharacterTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      textFieldName,
      debouncedValue,
    }: UpdateCharacterTranslationOnMutationTypes) =>
      await axiosCustomized.patch(`/characters/${characterId}/translations`, {
        currentLanguage: language,
        textFieldName,
        text: debouncedValue,
      }),
  });
}
