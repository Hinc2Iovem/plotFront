import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type DeleteCharacteristicTypes = {
  characteristicId: string;
  storyId: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function useDeleteCharacteristic({
  storyId,
  characteristicId,
  currentLanguage,
}: DeleteCharacteristicTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.delete(
        `/characteristics/${characteristicId}/translations?currentLanguage=${currentLanguage}`
      ),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", currentLanguage, "story", storyId, "characteristic"],
      });
    },
  });
}
