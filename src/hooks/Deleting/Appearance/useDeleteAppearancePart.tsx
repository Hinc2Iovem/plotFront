import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type DeleteAppearancePartTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  storyId: string;
};

type DeleteAppearancePartBodyTypes = {
  appearancePartId: string;
};

export default function useDeleteAppearancePart({ language, storyId }: DeleteAppearancePartTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appearancePartId }: DeleteAppearancePartBodyTypes) =>
      await axiosCustomized.delete(`/appearanceParts/${appearancePartId}`),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "story", storyId, "appearancePart"],
      });
    },
  });
}
