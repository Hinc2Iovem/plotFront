import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

type CreateSeasonByStoryIdTypes = {
  storyId: string;
  title: string;
  currentLanguage?: CurrentlyAvailableLanguagesTypes;
};

export default function useCreateNewSeason({
  storyId,
  currentLanguage = "russian",
  title,
}: CreateSeasonByStoryIdTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(`/seasons/stories/${storyId}/translations`, {
        title,
        currentLanguage,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stories", storyId, "season", "language", currentLanguage],
        exact: true,
        type: "all",
      }),
  });
}
