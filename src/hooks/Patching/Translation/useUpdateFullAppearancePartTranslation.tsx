import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateFullAppearancePartTranslationTypes = {
  appearancePartId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateFullAppearancePartTranslationOnMutationTypes = {
  storyId: string;
  appearancePartName?: string;
  appearancePartType?: TranslationTextFieldNameAppearancePartsTypes | "temp";
  appearancePartImg?: string;
};

export default function useUpdateFullAppearancePartTranslation({
  appearancePartId,
  language,
}: UpdateFullAppearancePartTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      appearancePartName,
      appearancePartType,
      storyId,
      appearancePartImg,
    }: UpdateFullAppearancePartTranslationOnMutationTypes) =>
      await axiosCustomized.put(`/appearanceParts/${appearancePartId}/translations`, {
        currentLanguage: language,
        appearancePartName,
        appearancePartType,
        appearancePartImg,
        storyId,
      }),
  });
}
