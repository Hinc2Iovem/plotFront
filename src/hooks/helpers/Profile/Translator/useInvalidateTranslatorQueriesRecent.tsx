import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type PossibleQueryKeys =
  | "appearancePart"
  | "character"
  | "episode"
  | "season"
  | "story"
  | "achievement"
  | "choice"
  | "characteristic"
  | "getItem"
  | "say"
  | "commandWardrobe";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  queryKey: PossibleQueryKeys;
  updatedAt: string;
  page: number;
  limit: number;
};

export default function useInvalidateTranslatorQueriesRecent({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  queryKey,
  updatedAt,
  limit,
  page,
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
          queryKey,
          "updatedAt",
          updatedAt,
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
          queryKey,
          "updatedAt",
          updatedAt,
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
          queryKey,
          "updatedAt",
          updatedAt,
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
