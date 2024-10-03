import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type InvalidateTranslatorQueriesTypes = {
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  type: TranslationTextFieldNameAppearancePartsTypes;
  characterId: string;
  page: number;
  limit: number;
};

export default function useInvalidateTranslatorAppearancePartsQueries({
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  characterId,
  type,
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
          "character",
          characterId,
          "appearancePart",
          "type",
          type,
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
          "character",
          characterId,
          "appearancePart",
          "type",
          type,
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
          "character",
          characterId,
          "appearancePart",
          "type",
          type,
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTranslateToLanguage, prevTranslateFromLanguage]);
  return null;
}
