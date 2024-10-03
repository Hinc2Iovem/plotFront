import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationEpisodeTypes } from "../../../types/Additional/TranslationTypes";

export default function useGetEpisodeTranslationByTextFieldNameAndSearch({
  debouncedValue,
  language,
  seasonId,
}: {
  debouncedValue: string;
  seasonId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      "textFieldName",
      "search",
      "episodes",
      debouncedValue,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationEpisodeTypes[]>(
          `/episodes/episodeStatus/search/translations?currentLanguage=${language}&text=${debouncedValue}&seasonId=${seasonId}`
        )
        .then((r) => r.data),
    enabled: !!language && !!seasonId,
  });
}
