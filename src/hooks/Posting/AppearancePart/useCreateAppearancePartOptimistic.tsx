import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type CreateAppearancePartTypes = {
  appearancePartName: string;
  storyId: string;
};

type CreateAppearancePartBodyTypes = {
  type?: TranslationTextFieldNameAppearancePartsTypes | "temp";
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  characterId?: string;
  img?: string;
  appearancePartId: string;
};

export default function useCreateAppearancePartOptimistic({ appearancePartName, storyId }: CreateAppearancePartTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appearancePartId, currentLanguage, characterId, type, img }: CreateAppearancePartBodyTypes) =>
      await axiosCustomized
        .post(`/appearanceParts/stories/${storyId}/optimistic/translations`, {
          appearancePartName,
          appearancePartId,
          type,
          currentLanguage,
          characterId,
          img,
        })
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", "russian", "story", storyId, "appearancePart"],
      });
    },
  });
}
