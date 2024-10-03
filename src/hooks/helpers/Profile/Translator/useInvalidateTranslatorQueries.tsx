import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  queryKey: string;
};

export default function useInvalidateTranslatorQueries({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  queryKey,
}: InvalidateTranslatorQueriesTypes) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (prevTranslateFromLanguage) {
      queryClient.invalidateQueries({
        queryKey: ["translation", prevTranslateFromLanguage, queryKey],
        predicate: (query) => {
          return (
            query.queryKey[0] === "translation" &&
            query.queryKey[1] === prevTranslateFromLanguage &&
            query.queryKey[2] === queryKey &&
            query.queryKey[3] != null
          );
        },
      });
      queryClient.invalidateQueries({
        queryKey: ["translation", translateToLanguage, queryKey],
        predicate: (query) => {
          return (
            query.queryKey[0] === "translation" &&
            query.queryKey[1] === translateToLanguage &&
            query.queryKey[2] === queryKey
          );
        },
      });
    }
    if (prevTranslateToLanguage || prevTranslateFromLanguage) {
      queryClient.invalidateQueries({
        queryKey: ["translation", prevTranslateToLanguage, queryKey],
        predicate: (query) => {
          return (
            query.queryKey[0] === "translation" &&
            query.queryKey[1] === prevTranslateToLanguage &&
            query.queryKey[2] === queryKey
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
