import { useMemo } from "react";
import useGetSeasonRecentTranslations from "../../../../../../hooks/Fetching/Translation/Season/useGetSeasonRecentTranslations";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedSeason from "../../../AboutStory/Display/Season/DisplayTranslatedNonTranslatedSeason";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";

type FiltersEverythingCharacterForSeasonTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedSeasonTypes = {
  translated: TranslationSeasonTypes | null;
  nonTranslated: TranslationSeasonTypes | null;
};

export default function FiltersEverythingStoryForSeasonRecent({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingCharacterForSeasonTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    queryKey: "season",
    updatedAt,
    page,
    limit: 3,
  });

  const { data: translatedSeason } = useGetSeasonRecentTranslations({
    updatedAt,
    language: translateFromLanguage,
    page,
    limit: 3,
  });

  const { data: nonTranslatedSeason } = useGetSeasonRecentTranslations({
    updatedAt,
    language: translateToLanguage,
    page,
    limit: 3,
  });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedSeasonTypes[] = [];
    const seasonMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedSeasonTypes;
    } = {};

    translatedSeason?.results.forEach((tc) => {
      const seasonId = tc.seasonId;
      if (!seasonMap[seasonId]) {
        seasonMap[seasonId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        seasonMap[seasonId].translated = tc;
      }
    });

    nonTranslatedSeason?.results.forEach((ntc) => {
      const seasonId = ntc.seasonId;
      if (!seasonMap[seasonId]) {
        seasonMap[seasonId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        seasonMap[seasonId].nonTranslated = ntc;
      }
    });

    Object.values(seasonMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedSeason, nonTranslatedSeason]);

  return (
    <>
      {memoizedCombinedTranslations.length ? (
        <main
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations.map((ct, i) => (
            <DisplayTranslatedNonTranslatedSeason
              key={(ct.translated?._id || i) + "-ctSeason"}
              languageToTranslate={translateToLanguage}
              lastIndex={memoizedCombinedTranslations.length - 1}
              currentIndex={i}
              translateFromLanguage={translateFromLanguage}
              {...ct}
            />
          ))}
        </main>
      ) : null}
    </>
  );
}
