import { useMemo } from "react";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { TranslationAchievementTypes } from "../../../../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";
import useGetAchievementRecentTranslations from "../../../../../../hooks/Fetching/Translation/PlotfieldCommands/Achievement/useGetAchievementRecentTranslations";
import DisplayTranslatedNonTranslatedPlotAchievement from "../../../Plot/Display/Plot/DisplayTranslatedNonTranslatedPlotAchievement";

type FiltersEverythingPlotAchievementTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedAchievementTypes = {
  translated: TranslationAchievementTypes | null;
  nonTranslated: TranslationAchievementTypes | null;
};

export default function FiltersEverythingPlotAchievementRecent({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingPlotAchievementTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "achievement",
    translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });
  const { data: translatedAchievements } = useGetAchievementRecentTranslations({
    language: translateFromLanguage,
    updatedAt,
    page,
    limit: 3,
  });
  const { data: nonTranslatedAchievements } =
    useGetAchievementRecentTranslations({
      language: translateToLanguage,
      updatedAt,
      page,
      limit: 3,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedAchievementTypes[] =
      [];
    const achievementMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedAchievementTypes;
    } = {};

    translatedAchievements?.results.forEach((tc) => {
      const achievementId = tc.commandId;
      if (!achievementMap[achievementId]) {
        achievementMap[achievementId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        achievementMap[achievementId].translated = tc;
      }
    });

    nonTranslatedAchievements?.results.forEach((ntc) => {
      const achievementId = ntc.commandId;
      if (!achievementMap[achievementId]) {
        achievementMap[achievementId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        achievementMap[achievementId].nonTranslated = ntc;
      }
    });

    Object.values(achievementMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedAchievements, nonTranslatedAchievements]);

  return (
    <>
      {(memoizedCombinedTranslations?.length || 0) > 0 ? (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedPlotAchievement
              key={t.translated?._id || i + "-achievement"}
              languageToTranslate={translateToLanguage}
              currentIndex={i}
              lastIndex={memoizedCombinedTranslations.length - 1}
              translateFromLanguage={translateFromLanguage}
              {...t}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
