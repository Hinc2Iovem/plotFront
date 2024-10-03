import { useMemo } from "react";
import useInvalidateTranslatorQueriesCommands from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesCommands";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../../types/Additional/TranslationTypes";
import useGetAllAchievementTranslationsByTopologyBlockId from "../../../../../hooks/Fetching/Translation/PlotfieldCommands/Achievement/useGetAllAchievementTranslationsByTopologyBlockId";
import DisplayTranslatedNonTranslatedPlotAchievement from "../Display/Plot/DisplayTranslatedNonTranslatedPlotAchievement";

type FiltersEverythingPlotAchievementTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  topologyBlockId: string;
};

export type CombinedTranslatedAndNonTranslatedAchievementTypes = {
  translated: TranslationAchievementTypes | null;
  nonTranslated: TranslationAchievementTypes | null;
};

export default function FiltersEverythingPlotAchievement({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  topologyBlockId,
}: FiltersEverythingPlotAchievementTypes) {
  useInvalidateTranslatorQueriesCommands({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "achievement",
    translateToLanguage,
  });
  const { data: translatedAchievements } =
    useGetAllAchievementTranslationsByTopologyBlockId({
      language: translateFromLanguage,
      topologyBlockId,
    });
  const { data: nonTranslatedAchievements } =
    useGetAllAchievementTranslationsByTopologyBlockId({
      language: translateToLanguage,
      topologyBlockId,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedAchievementTypes[] =
      [];
    const achievementMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedAchievementTypes;
    } = {};

    translatedAchievements?.forEach((tc) => {
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

    nonTranslatedAchievements?.forEach((ntc) => {
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
          className={`grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedPlotAchievement
              key={t.translated?._id || i + "-achievement"}
              lastIndex={memoizedCombinedTranslations.length - 1}
              currentIndex={i}
              languageToTranslate={translateToLanguage}
              translateFromLanguage={translateFromLanguage}
              {...t}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
