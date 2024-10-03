import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateStoryTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  description: string;
  title: string;
  genres: string;
  imgUrl: string;
};

export default function useCreateStory({
  currentLanguage,
  description,
  genres,
  imgUrl,
  title,
}: CreateStoryTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post("/stories/translations", {
        currentLanguage,
        description,
        genres,
        imgUrl,
        title,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", "stories", "search"],
      });
    },
  });
}
