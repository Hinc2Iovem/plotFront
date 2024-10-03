import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  storyId: string;
  page: number;
  limit: number;
};

export default function useInvalidateTranslatorCharacteristicQueries({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  storyId,
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
          "story",
          storyId,
          "characteristic",
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
          "story",
          storyId,
          "characteristic",
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
          "story",
          storyId,
          "characteristic",
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
