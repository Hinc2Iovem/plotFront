import { useMemo } from "react";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSayTypes } from "../../../../../../types/Additional/TranslationTypes";
import useGetSayRecentTranslations from "../../../../../../hooks/Fetching/Translation/PlotfieldCommands/Say/useGetSayRecentTranslations";
import DisplayTranslatedNonTranslatedPlotSay from "../../../Plot/Display/Plot/DisplayTranslatedNonTranslatedPlotSay";

type FiltersEverythingPlotSayTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedSayTypes = {
  translated: TranslationSayTypes | null;
  nonTranslated: TranslationSayTypes | null;
};

export default function FiltersEverythingPlotSayRecent({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingPlotSayTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "say",
    translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });

  const { data: translatedSays } = useGetSayRecentTranslations({
    language: translateFromLanguage,
    updatedAt,
    page,
    limit: 3,
  });
  const { data: nonTranslatedSays } = useGetSayRecentTranslations({
    language: translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedSayTypes[] = [];
    const sayMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedSayTypes;
    } = {};

    translatedSays?.results.forEach((tc) => {
      const sayId = tc.commandId;
      if (!sayMap[sayId]) {
        sayMap[sayId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        sayMap[sayId].translated = tc;
      }
    });

    nonTranslatedSays?.results.forEach((ntc) => {
      const sayId = ntc.commandId;
      if (!sayMap[sayId]) {
        sayMap[sayId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        sayMap[sayId].nonTranslated = ntc;
      }
    });

    Object.values(sayMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedSays, nonTranslatedSays]);

  return (
    <>
      {(memoizedCombinedTranslations?.length || 0) > 0 ? (
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedPlotSay
              key={t.translated?._id || i + "-say"}
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
