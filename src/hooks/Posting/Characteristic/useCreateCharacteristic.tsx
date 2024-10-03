import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateCharacteristicTypes = {
  storyId: string;
  characteristicName: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useCreateCharacteristic({
  characteristicName,
  storyId,
  language = "russian",
}: CreateCharacteristicTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/characteristics/stories/${storyId}/translations`,
        {
          text: characteristicName,
          currentLanguage: language,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "story", storyId, "characteristic"],
        exact: true,
        type: "active",
      });
    },
  });
}
