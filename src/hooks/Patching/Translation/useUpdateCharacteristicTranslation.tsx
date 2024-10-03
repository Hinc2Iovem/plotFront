import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldName } from "../../../const/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateCharacterTranslationTypes = {
  characterCharacteristicId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateCharacterTranslationOnMutationTypes = {
  characteristicName: string;
};

export default function useUpdateCharacteristicTranslation({
  characterCharacteristicId,
  storyId,
  language,
}: UpdateCharacterTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      characteristicName,
    }: UpdateCharacterTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/characteristics/${characterCharacteristicId}/stories/${storyId}/translations`,
        {
          currentLanguage: language,
          text: characteristicName,
          textFieldName: TranslationTextFieldName.CharacterCharacteristic,
        }
      ),
  });
}
