import { useMemo, useState } from "react";
import useGetPaginatedTranslationSeasons from "../../../../../hooks/Fetching/Translation/Season/useGetPaginatedTranslationSeasons";
import useInvalidateTranslatorSeasonQueries from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorSeasonQueries";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../../../types/Additional/TranslationTypes";
import StoryPrompt from "../../InputPrompts/StoryPrompt/StoryPrompt";
import DisplayTranslatedNonTranslatedSeason from "../Display/Season/DisplayTranslatedNonTranslatedSeason";

type FiltersEverythingCharacterForSeasonTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export type CombinedTranslatedAndNonTranslatedSeasonTypes = {
  translated: TranslationSeasonTypes | null;
  nonTranslated: TranslationSeasonTypes | null;
};

export default function FiltersEverythingStoryForSeason({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
}: FiltersEverythingCharacterForSeasonTypes) {
  const [storyId, setStoryId] = useState("");
  const [page, setPage] = useState(1);
  console.log(setPage);

  useInvalidateTranslatorSeasonQueries({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    storyId,
    limit: 3,
    page,
  });

  const { data: translatedSeason } = useGetPaginatedTranslationSeasons({
    storyId,
    language: translateFromLanguage,
    limit: 3,
    page,
  });

  const { data: nonTranslatedSeason } = useGetPaginatedTranslationSeasons({
    storyId,
    language: translateToLanguage,
    limit: 3,
    page,
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
      <div className="flex w-full gap-[1rem] bg-secondary-darker px-[.5rem] py-[.5rem] rounded-md shadow-sm">
        <StoryPrompt
          setStoryId={setStoryId}
          currentLanguage={translateFromLanguage}
          currentTranslationView={"season"}
          translateToLanguage={translateToLanguage}
        />
      </div>
      <main
        className={`grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] gap-[1rem] w-full`}
      >
        {memoizedCombinedTranslations.map((ct, i) => (
          <DisplayTranslatedNonTranslatedSeason
            key={(ct.translated?._id || i) + "-ctSeason"}
            currentIndex={i}
            lastIndex={memoizedCombinedTranslations.length - 1}
            languageToTranslate={translateToLanguage}
            translateFromLanguage={translateFromLanguage}
            {...ct}
          />
        ))}
      </main>
    </>
  );
}
