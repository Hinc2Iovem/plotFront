import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type CreateAppearancePartTypes = {
  characterId: string;
  appearanceType: TranslationTextFieldNameAppearancePartsTypes;
  appearancePartName: string;
};

export default function useCreateAppearancePart({
  characterId,
  appearancePartName,
  appearanceType,
}: CreateAppearancePartTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/appearanceParts/characters/${characterId}/translations`,
        {
          appearancePartName,
          type: appearanceType,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appearancePart", appearanceType, "character", characterId],
        exact: true,
        type: "active",
      });
    },
  });
}
