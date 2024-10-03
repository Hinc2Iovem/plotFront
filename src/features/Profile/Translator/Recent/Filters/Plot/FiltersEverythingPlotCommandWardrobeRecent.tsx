import { useMemo } from "react";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";
import { TranslationCommandWardrobeTypes } from "../../../../../../types/Additional/TranslationTypes";
import useGetCommandWardrobeRecentTranslations from "../../../../../../hooks/Fetching/Translation/PlotfieldCommands/CommandWardrobe/useGetCommandWardrobeRecentTranslations";
import DisplayTranslatedNonTranslatedPlotCommandWardrobe from "../../../Plot/Display/Plot/DisplayTranslatedNonTranslatedPlotCommandWardrobe";

type FiltersEverythingPlotCommandWardrobeTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedCommandWardrobeTypes = {
  translated: TranslationCommandWardrobeTypes | null;
  nonTranslated: TranslationCommandWardrobeTypes | null;
};

export default function FiltersEverythingPlotCommandWardrobeRecent({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingPlotCommandWardrobeTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "commandWardrobe",
    translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });
  const { data: translatedCommandWardrobes } =
    useGetCommandWardrobeRecentTranslations({
      language: translateFromLanguage,
      updatedAt,
      page,
      limit: 3,
    });
  const { data: nonTranslatedCommandWardrobes } =
    useGetCommandWardrobeRecentTranslations({
      language: translateToLanguage,
      updatedAt,
      page,
      limit: 3,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedCommandWardrobeTypes[] =
      [];
    const commandWardrobeMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedCommandWardrobeTypes;
    } = {};

    translatedCommandWardrobes?.results.forEach((tc) => {
      const commandWardrobeId = tc.commandId;
      if (!commandWardrobeMap[commandWardrobeId]) {
        commandWardrobeMap[commandWardrobeId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        commandWardrobeMap[commandWardrobeId].translated = tc;
      }
    });

    nonTranslatedCommandWardrobes?.results.forEach((ntc) => {
      const commandWardrobeId = ntc.commandId;
      if (!commandWardrobeMap[commandWardrobeId]) {
        commandWardrobeMap[commandWardrobeId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        commandWardrobeMap[commandWardrobeId].nonTranslated = ntc;
      }
    });

    Object.values(commandWardrobeMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedCommandWardrobes, nonTranslatedCommandWardrobes]);

  return (
    <>
      {(memoizedCombinedTranslations?.length || 0) > 0 ? (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedPlotCommandWardrobe
              key={t.translated?._id || i + "-commandWardrobe"}
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
