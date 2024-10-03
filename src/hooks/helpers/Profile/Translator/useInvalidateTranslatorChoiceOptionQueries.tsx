import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  plotFieldCommandChoiceId: string;
};

export default function useInvalidateTranslatorChoiceOptionQueries({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  plotFieldCommandChoiceId,
}: InvalidateTranslatorQueriesTypes) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (prevTranslateFromLanguage) {
      queryClient.invalidateQueries({
        queryKey: [
          "choice",
          plotFieldCommandChoiceId,
          "translation",
          prevTranslateFromLanguage,
          "option",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "choice",
          plotFieldCommandChoiceId,
          "translation",
          translateToLanguage,
          "option",
        ],
      });
    }
    if (prevTranslateToLanguage || prevTranslateFromLanguage) {
      queryClient.invalidateQueries({
        queryKey: [
          "choice",
          plotFieldCommandChoiceId,
          "translation",
          prevTranslateToLanguage,
          "option",
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
