import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateNewEpisodeTypes = {
  seasonId: string;
  language?: CurrentlyAvailableLanguagesTypes;
  title: string;
  description: string;
};

export default function useCreateNewEpisode({
  seasonId,
  language = "russian",
  title,
  description,
}: CreateNewEpisodeTypes) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(`/episodes/seasons/${seasonId}/translations`, {
        currentLanguage: language,
        title,
        description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["episodes", "seasons", seasonId],
        exact: true,
        type: "all",
      });
    },
  });
}
