import { useMemo } from "react";
import useGetAllGetItemTranslationsByTopologyBlockId from "../../../../../hooks/Fetching/Translation/PlotfieldCommands/GetItem/useGetAllGetItemTranslationsByTopologyBlockId";
import useInvalidateTranslatorQueriesCommands from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesCommands";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import DisplayTranslatedNonTranslatedPlotGetItem from "../Display/Plot/DisplayTranslatedNonTranslatedPlotGetItem";
import { TranslationGetItemTypes } from "../../../../../types/Additional/TranslationTypes";

type FiltersEverythingPlotGetItemTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  topologyBlockId: string;
};

export type CombinedTranslatedAndNonTranslatedGetItemTypes = {
  translated: TranslationGetItemTypes | null;
  nonTranslated: TranslationGetItemTypes | null;
};

export default function FiltersEverythingPlotGetItem({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  topologyBlockId,
}: FiltersEverythingPlotGetItemTypes) {
  useInvalidateTranslatorQueriesCommands({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "getItem",
    translateToLanguage,
  });
  const { data: translatedGetItems } =
    useGetAllGetItemTranslationsByTopologyBlockId({
      language: translateFromLanguage,
      topologyBlockId,
    });
  const { data: nonTranslatedGetItems } =
    useGetAllGetItemTranslationsByTopologyBlockId({
      language: translateToLanguage,
      topologyBlockId,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedGetItemTypes[] = [];
    const getItemMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedGetItemTypes;
    } = {};

    translatedGetItems?.forEach((tc) => {
      const getItemId = tc.commandId;
      if (!getItemMap[getItemId]) {
        getItemMap[getItemId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        getItemMap[getItemId].translated = tc;
      }
    });

    nonTranslatedGetItems?.forEach((ntc) => {
      const getItemId = ntc.commandId;
      if (!getItemMap[getItemId]) {
        getItemMap[getItemId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        getItemMap[getItemId].nonTranslated = ntc;
      }
    });

    Object.values(getItemMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedGetItems, nonTranslatedGetItems]);
  return (
    <>
      {(memoizedCombinedTranslations?.length || 0) > 0 ? (
        <div
          className={`grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedPlotGetItem
              key={t.translated?._id || i + "-getItem"}
              languageToTranslate={translateToLanguage}
              lastIndex={memoizedCombinedTranslations.length - 1}
              currentIndex={i}
              translateFromLanguage={translateFromLanguage}
              {...t}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
