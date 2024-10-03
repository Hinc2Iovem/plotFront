import { useMemo } from "react";
import useGetAllCommandWardrobeTranslationsByTopologyBlockId from "../../../../../hooks/Fetching/Translation/PlotfieldCommands/CommandWardrobe/useGetAllCommandWardrobeTranslationsByTopologyBlockId";
import useInvalidateTranslatorQueriesCommands from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesCommands";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandWardrobeTypes } from "../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedPlotCommandWardrobe from "../Display/Plot/DisplayTranslatedNonTranslatedPlotCommandWardrobe";

type FiltersEverythingPlotCommandWardrobeTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  topologyBlockId: string;
};

export type CombinedTranslatedAndNonTranslatedCommandWardrobeTypes = {
  translated: TranslationCommandWardrobeTypes | null;
  nonTranslated: TranslationCommandWardrobeTypes | null;
};

export default function FiltersEverythingPlotCommandWardrobe({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  topologyBlockId,
}: FiltersEverythingPlotCommandWardrobeTypes) {
  useInvalidateTranslatorQueriesCommands({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "commandWardrobe",
    translateToLanguage,
  });
  const { data: translatedCommandWardrobes } =
    useGetAllCommandWardrobeTranslationsByTopologyBlockId({
      language: translateFromLanguage,
      topologyBlockId,
    });
  const { data: nonTranslatedCommandWardrobes } =
    useGetAllCommandWardrobeTranslationsByTopologyBlockId({
      language: translateToLanguage,
      topologyBlockId,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedCommandWardrobeTypes[] =
      [];
    const commandWardrobeMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedCommandWardrobeTypes;
    } = {};

    translatedCommandWardrobes?.forEach((tc) => {
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

    nonTranslatedCommandWardrobes?.forEach((ntc) => {
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
          className={`grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedPlotCommandWardrobe
              key={t.translated?._id || i + "-commandWardrobe"}
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
