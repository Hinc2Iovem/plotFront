import { useMemo } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import useGetChoiceRecentTranslations from "../../../../../../hooks/Fetching/Translation/PlotfieldCommands/Choice/useGetChoiceRecentTranslations";
import { TranslationChoiceTypes } from "../../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedChoice from "../../../Plot/Display/Plot/DisplayTranslatedNonTranslatedChoice";

type FiltersEverythingPlotChoiceTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedChoiceTypes = {
  translated: TranslationChoiceTypes | null;
  nonTranslated: TranslationChoiceTypes | null;
};

export default function FiltersEverythingPlotChoiceRecent({
  translateFromLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  translateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingPlotChoiceTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    queryKey: "choice",
    translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });

  const { data: translatedChoices } = useGetChoiceRecentTranslations({
    language: translateFromLanguage,
    updatedAt,
    page,
    limit: 3,
  });
  const { data: nonTranslatedChoices } = useGetChoiceRecentTranslations({
    language: translateToLanguage,
    updatedAt,
    page,
    limit: 3,
  });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedChoiceTypes[] = [];
    const choiceMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedChoiceTypes;
    } = {};

    translatedChoices?.results.forEach((tc) => {
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

    nonTranslatedChoices?.results.forEach((ntc) => {
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
          className={`grid grid-cols-[repeat(auto-fit,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(50rem,1fr))] gap-[1rem] w-full`}
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
