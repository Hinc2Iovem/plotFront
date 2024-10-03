import { useMemo } from "react";
import useGetEpisodeRecentTranslations from "../../../../../../hooks/Fetching/Translation/Episode/useGetEpisodeRecentTranslations";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationEpisodeTypes } from "../../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedEpisode from "../../../AboutStory/Display/Episode/DisplayTranslatedNonTranslatedEpisode";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";

type FiltersEverythingCharacterForEpisodeTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedEpisodeTypes = {
  translated: TranslationEpisodeTypes | null;
  nonTranslated: TranslationEpisodeTypes | null;
};

export default function FiltersEverythingStoryForEpisodeRecent({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingCharacterForEpisodeTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    queryKey: "episode",
    updatedAt,
    page,
    limit: 3,
  });

  const { data: translatedEpisode } = useGetEpisodeRecentTranslations({
    updatedAt,
    language: translateFromLanguage,
    page,
    limit: 3,
  });

  const { data: nonTranslatedEpisode } = useGetEpisodeRecentTranslations({
    updatedAt,
    language: translateToLanguage,
    page,
    limit: 3,
  });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedEpisodeTypes[] = [];
    const episodeMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedEpisodeTypes;
    } = {};

    translatedEpisode?.results.forEach((tc) => {
      const episodeId = tc.episodeId;
      if (!episodeMap[episodeId]) {
        episodeMap[episodeId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        episodeMap[episodeId].translated = tc;
      }
    });

    nonTranslatedEpisode?.results.forEach((ntc) => {
      const episodeId = ntc.episodeId;
      if (!episodeMap[episodeId]) {
        episodeMap[episodeId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        episodeMap[episodeId].nonTranslated = ntc;
      }
    });

    Object.values(episodeMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedEpisode, nonTranslatedEpisode]);

  return (
    <>
      {memoizedCombinedTranslations.length ? (
        <main
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations.map((ct, i) => (
            <DisplayTranslatedNonTranslatedEpisode
              key={(ct.translated?._id || i) + "-ctEpisode"}
              languageToTranslate={translateToLanguage}
              currentIndex={i}
              lastIndex={memoizedCombinedTranslations.length - 1}
              translateFromLanguage={translateFromLanguage}
              {...ct}
            />
          ))}
        </main>
      ) : null}
    </>
  );
}
