import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../types/Additional/TranslationTypes";

export default function useGetCharacterTranslationByTextFieldNameAndSearch({
  debouncedValue,
  language,
  storyId,
  showCharacters,
}: {
  debouncedValue: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
  showCharacters: boolean;
}) {
  return useQuery({
    queryKey: [
      "translation",
      language,
      "story",
      storyId,
      "search",
      "characters",
      debouncedValue,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCharacterTypes[]>(
          `/characters/stories/languages/search/translations?currentLanguage=${language}&text=${debouncedValue}&storyId=${storyId}`
        )
        .then((r) => r.data),
    enabled: !!language && showCharacters,
  });
}
