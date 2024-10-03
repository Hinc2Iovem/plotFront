import { useMemo } from "react";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../../../../types/Additional/TranslationTypes";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import useGetStoryRecentTranslations from "../../../../../../hooks/Fetching/Translation/Story/useGetStoryRecentTranslations";
import DisplayTranslatedNonTranslatedStory from "../../../AboutStory/Display/Story/DisplayTranslatedNonTranslatedStory";

type FiltersEverythingCharacterForStoryTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedStoryTypes = {
  translated: TranslationStoryTypes | null;
  nonTranslated: TranslationStoryTypes | null;
};

export default function FiltersEverythingStoryForStoryRecent({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingCharacterForStoryTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    queryKey: "story",
    updatedAt,
    page,
    limit: 3,
  });

  const { data: translatedStory } = useGetStoryRecentTranslations({
    language: translateFromLanguage,
    updatedAt,
    page,
    limit: 3,
  });

  const { data: nonTranslatedStory } = useGetStoryRecentTranslations({
    language: translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedStoryTypes[] = [];
    const storyMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedStoryTypes;
    } = {};

    translatedStory?.results.forEach((tc) => {
      const storyId = tc.storyId;
      if (!storyMap[storyId]) {
        storyMap[storyId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        storyMap[storyId].translated = tc;
      }
    });

    nonTranslatedStory?.results.forEach((ntc) => {
      const storyId = ntc.storyId;
      if (!storyMap[storyId]) {
        storyMap[storyId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        storyMap[storyId].nonTranslated = ntc;
      }
    });

    Object.values(storyMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedStory, nonTranslatedStory]);

  return (
    <>
      {memoizedCombinedTranslations.length ? (
        <main
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations.map((ct, i) => (
            <DisplayTranslatedNonTranslatedStory
              key={(ct.translated?._id || i) + "-ctStory"}
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
