import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateCharacteristicTypes = {
  storyId: string;
  characteristicName?: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type CreateCharacteristicTypesOnMutation = {
  characteristicId: string;
  characteristicNameBody?: string;
};

export default function useCreateCharacteristicOptimistic({
  characteristicName,
  storyId,
  language = "russian",
}: CreateCharacteristicTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ characteristicId, characteristicNameBody }: CreateCharacteristicTypesOnMutation) =>
      await axiosCustomized.post(`/characteristics/stories/${storyId}/optimistic/translations`, {
        text: characteristicNameBody?.trim().length ? characteristicNameBody : characteristicName,
        currentLanguage: language,
        characteristicId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "story", storyId, "characteristic"],
        exact: true,
        type: "active",
      });
    },
  });
}
