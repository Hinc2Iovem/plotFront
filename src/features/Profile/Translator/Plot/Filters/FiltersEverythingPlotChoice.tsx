import { useMemo } from "react";
import useGetAllChoiceTranslationsByTopologyBlockId from "../../../../../hooks/Fetching/Translation/PlotfieldCommands/Choice/useGetAllChoiceTranslationsByTopologyBlockId";
import useInvalidateTranslatorQueriesCommands from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesCommands";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationChoiceTypes } from "../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedChoice from "../Display/Plot/DisplayTranslatedNonTranslatedChoice";

type FiltersEverythingPlotChoiceTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  topologyBlockId: string;
};

export type CombinedTranslatedAndNonTranslatedChoiceTypes = {
  translated: TranslationChoiceTypes | null;
  nonTranslated: TranslationChoiceTypes | null;
};

export default function FiltersEverythingPlotChoice({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  topologyBlockId,
}: FiltersEverythingPlotChoiceTypes) {
  useInvalidateTranslatorQueriesCommands({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "choice",
    translateToLanguage,
  });

  const { data: translatedChoices } =
    useGetAllChoiceTranslationsByTopologyBlockId({
      language: translateFromLanguage,
      topologyBlockId,
    });
  const { data: nonTranslatedChoices } =
    useGetAllChoiceTranslationsByTopologyBlockId({
      language: translateToLanguage,
      topologyBlockId,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedChoiceTypes[] = [];
    const choiceMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedChoiceTypes;
    } = {};

    translatedChoices?.forEach((tc) => {
      const choiceId = tc.commandId;
      if (!choiceMap[choiceId]) {
        choiceMap[choiceId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        choiceMap[choiceId].translated = tc;
      }
    });

    nonTranslatedChoices?.forEach((ntc) => {
      const choiceId = ntc.commandId;
      if (!choiceMap[choiceId]) {
        choiceMap[choiceId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        choiceMap[choiceId].nonTranslated = ntc;
      }
    });

    Object.values(choiceMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedChoices, nonTranslatedChoices]);

  return (
    <>
      {(memoizedCombinedTranslations?.length || 0) > 0 ? (
        <div
          className={`grid grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(50rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations?.map((t, i) => (
            <DisplayTranslatedNonTranslatedChoice
              key={t.translated?._id || i + "-choice"}
              languageToTranslate={translateToLanguage}
              translateFromLanguage={translateFromLanguage}
              lastIndex={memoizedCombinedTranslations.length - 1}
              currentIndex={i}
              prevTranslateFromLanguage={prevTranslateFromLanguage}
              prevTranslateToLanguage={prevTranslateToLanguage}
              {...t}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
