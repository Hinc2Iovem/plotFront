import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

type CheckEpisodeTranslationCompletnessBySeasonIdTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  seasonId: string;
};

export default function useCheckEpisodeTranslationCompletnessBySeasonId({
  currentLanguage,
  seasonId,
  translateToLanguage,
}: CheckEpisodeTranslationCompletnessBySeasonIdTypes) {
  return useQuery({
    queryKey: [
      "completness",
      "translation",
      "from",
      currentLanguage,
      "to",
      translateToLanguage,
      "episode",
      "season",
      seasonId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<boolean>(
          `/episodes/seasons/${seasonId}/completness/translations?currentLanguage=${currentLanguage}&translateToLanguage=${translateToLanguage}`
        )
        .then((r) => r.data),
    enabled: !!currentLanguage && !!translateToLanguage && !!seasonId,
  });
}
