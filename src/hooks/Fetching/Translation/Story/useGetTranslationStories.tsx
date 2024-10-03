import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetTranslationStories({
  language = "russian",
}: {
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "story"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationStoryTypes[]>(
          `/stories/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!language,
  });
}
