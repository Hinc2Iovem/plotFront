import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type CreateAppearancePartTypes = {
  characterId: string;
  appearanceType: TranslationTextFieldNameAppearancePartsTypes | "temp";
  appearancePartName: string;
  storyId: string;
};

export default function useCreateAppearancePart({
  characterId,
  appearancePartName,
  appearanceType,
  storyId,
}: CreateAppearancePartTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(`/appearanceParts/stories/${storyId}/characters/${characterId}/translations`, {
        appearancePartName,
        type: appearanceType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appearancePart", appearanceType, "character", characterId],
        exact: true,
        type: "active",
      });
    },
  });
}
