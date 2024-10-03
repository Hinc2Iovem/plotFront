import { useMemo } from "react";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationChoiceOptionTypes } from "../../../../../../../../types/Additional/TranslationTypes";
import { ChoiceOptionVariationsTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useGetAllChoiceOptionsByChoiceId from "./useGetChoiceAllChoiceOptionsByChoiceId";

type CombinedTranslatedAndNonTranslatedChoiceOptionsTypes = {
  translated: TranslationChoiceOptionTypes | null;
  nonTranslated: TranslationChoiceOptionTypes | null;
  choiceOptionId: string;
  type: ChoiceOptionVariationsTypes;
};

type MemoizeChoiceOptionsTypes = {
  commandId: string;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
};

export default function useMemoizeChoiceOptions({
  commandId,
  translateFromLanguage,
  languageToTranslate,
}: MemoizeChoiceOptionsTypes) {
  const { data: allTranslatedOptions } = useGetAllChoiceOptionsByChoiceId({
    plotFieldCommandChoiceId: commandId,
    language: translateFromLanguage,
  });
  const { data: allNonTranslatedOptions } = useGetAllChoiceOptionsByChoiceId({
    plotFieldCommandChoiceId: commandId,
    language: languageToTranslate,
  });

  return useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedChoiceOptionsTypes[] =
      [];
    const choiceMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedChoiceOptionsTypes;
    } = {};

    allTranslatedOptions?.forEach((tc, i) => {
      const choiceOptionId = tc.choiceOptionId;
      if (!choiceMap[choiceOptionId]) {
        choiceMap[choiceOptionId] = {
          translated: tc,
          nonTranslated: null,
          choiceOptionId,
          type: allTranslatedOptions[i].type || "",
        };
      } else {
        choiceMap[choiceOptionId].translated = tc;
      }
    });

    allNonTranslatedOptions?.forEach((ntc, i) => {
      const choiceOptionId = ntc.choiceOptionId;
      if (!choiceMap[choiceOptionId]) {
        choiceMap[choiceOptionId] = {
          translated: null,
          nonTranslated: ntc,
          choiceOptionId,
          type: allNonTranslatedOptions[i].type || "",
        };
      } else {
        choiceMap[choiceOptionId].nonTranslated = ntc;
      }
    });

    Object.values(choiceMap).forEach((entry) => {
      const translated = entry.translated;
      const nonTranslated = entry.nonTranslated;

      const combinedEntry = {
        choiceOptionId:
          translated?.choiceOptionId || nonTranslated?.choiceOptionId || "",
        type: translated?.type || nonTranslated?.type || "common",
        translated,
        nonTranslated,
      };

      combinedArray.push(combinedEntry);
    });

    return combinedArray;
  }, [allNonTranslatedOptions, allTranslatedOptions]);
}
