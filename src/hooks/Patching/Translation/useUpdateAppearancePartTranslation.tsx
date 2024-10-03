import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateCharacterTranslationTypes = {
  appearancePartId: string;
  characterId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateCharacterTranslationOnMutationTypes = {
  appearancePartName: string;
  appearancePartType: TranslationTextFieldNameAppearancePartsTypes;
};

export default function useUpdateAppearancePartTranslation({
  appearancePartId,
  characterId,
  language,
}: UpdateCharacterTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      appearancePartName,
      appearancePartType,
    }: UpdateCharacterTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/appearanceParts/${appearancePartId}/characters/${characterId}/translations`,
        {
          currentLanguage: language,
          text: appearancePartName,
          textFieldName: appearancePartType,
        }
      ),
  });
}
