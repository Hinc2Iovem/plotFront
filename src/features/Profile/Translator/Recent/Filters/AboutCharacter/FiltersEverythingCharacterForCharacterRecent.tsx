import { useMemo } from "react";
import useGetPaginatedCharacterRecentTranslations from "../../../../../../hooks/Fetching/Translation/Characters/useGetPaginatedCharacterRecentTranslations";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedCharacterRecent from "../../Display/AboutCharacter/DisplayTranslatedNonTranslatedCharacterRecent";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";

type FiltersEverythingCharacterForCharacterTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedCharacterTypes = {
  translated: TranslationCharacterTypes | null;
  nonTranslated: TranslationCharacterTypes | null;
};

export default function FiltersEverythingCharacterForCharacterRecent({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingCharacterForCharacterTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    queryKey: "character",
    updatedAt,
    page,
    limit: 3,
  });

  const { data: translatedCharacters } =
    useGetPaginatedCharacterRecentTranslations({
      updatedAt,
      language: translateFromLanguage,
      page,
      limit: 3,
    });

  const { data: nonTranslatedCharacters } =
    useGetPaginatedCharacterRecentTranslations({
      updatedAt,
      language: translateToLanguage,
      page,
      limit: 3,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedCharacterTypes[] =
      [];
    const characterMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedCharacterTypes;
    } = {};

    translatedCharacters?.results.forEach((tc) => {
      const characterId = tc.characterId;
      if (!characterMap[characterId]) {
        characterMap[characterId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        characterMap[characterId].translated = tc;
      }
    });

    nonTranslatedCharacters?.results.forEach((ntc) => {
      const characterId = ntc.characterId;
      if (!characterMap[characterId]) {
        characterMap[characterId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        characterMap[characterId].nonTranslated = ntc;
      }
    });

    Object.values(characterMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedCharacters, nonTranslatedCharacters]);

  return (
    <>
      {memoizedCombinedTranslations.length ? (
        <main
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations.map((ct, i) => {
            return (
              <DisplayTranslatedNonTranslatedCharacterRecent
                key={(ct?.translated?._id || i) + "-ct"}
                translateFromLanguage={translateFromLanguage}
                lastIndex={memoizedCombinedTranslations.length - 1}
                currentIndex={i}
                languageToTranslate={translateToLanguage}
                {...ct}
              />
            );
          })}
        </main>
      ) : null}
    </>
  );
}
