import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  seasonId: string;
  page: number;
  limit: number;
};

export default function useInvalidateTranslatorEpisodeQueries({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  seasonId,
  page,
  limit,
}: InvalidateTranslatorQueriesTypes) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (prevTranslateFromLanguage) {
      queryClient.invalidateQueries({
        queryKey: [
          "paginated",
          "page",
          page,
          "limit",
          limit,
          "translation",
          prevTranslateFromLanguage,
          "season",
          seasonId,
          "episode",
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "paginated",
          "page",
          page,
          "limit",
          limit,
          "translation",
          translateToLanguage,
          "season",
          seasonId,
          "episode",
        ],
      });
    }
    if (prevTranslateToLanguage || prevTranslateFromLanguage) {
      queryClient.invalidateQueries({
        queryKey: [
          "paginated",
          "page",
          page,
          "limit",
          limit,
          "translation",
          prevTranslateToLanguage,
          "season",
          seasonId,
          "episode",
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
