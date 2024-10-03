import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  storyId: string;
  characterType: string;
  page: number;
  limit: number;
};

export default function useInvalidateTranslatorCharacterQueries({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  storyId,
  limit,
  page,
  characterType,
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
          "character",
          characterType,
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
          "character",
          characterType,
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
          "character",
          characterType,
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
