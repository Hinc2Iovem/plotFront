import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetAllCharacteristicsByStoryId({
  storyId,
  language = "russian",
}: {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "story", storyId, "characteristic"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCharacterCharacteristicTypes[]>(
          `/characteristics/stories/${storyId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!storyId && !!language,
  });
}
