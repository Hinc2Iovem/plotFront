import { useMemo } from "react";
import useGetPaginatedAppearancePartRecentTranslations from "../../../../../../hooks/Fetching/Translation/AppearancePart/useGetPaginatedAppearancePartRecentTranslations";
import useInvalidateTranslatorQueriesRecent from "../../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorQueriesRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAppearancePartTypes } from "../../../../../../types/Additional/TranslationTypes";
import DisplayTranslatedNonTranslatedAppearancePart from "../../../AboutCharacter/Display/AppearancePart/DisplayTranslatedNonTranslatedAppearancePart";
import { UpdatedAtPossibleVariationTypes } from "../FiltersEverythingRecent";

type FiltersEverythingCharacterForAppearancePartTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
  updatedAt: UpdatedAtPossibleVariationTypes;
  page: number;
};

export type CombinedTranslatedAndNonTranslatedAppearancePartTypes = {
  translated: TranslationAppearancePartTypes | null;
  nonTranslated: TranslationAppearancePartTypes | null;
};

export default function FiltersEverythingCharacterForAppearancePartRecent({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
  updatedAt,
  page,
}: FiltersEverythingCharacterForAppearancePartTypes) {
  useInvalidateTranslatorQueriesRecent({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    updatedAt,
    queryKey: "appearancePart",
    page,
    limit: 3,
  });

  const { data: translatedAppearancePart } =
    useGetPaginatedAppearancePartRecentTranslations({
      updatedAt,
      language: translateFromLanguage,
      page,
      limit: 3,
    });

  const { data: nonTranslatedAppearancePart } =
    useGetPaginatedAppearancePartRecentTranslations({
      updatedAt,
      language: translateToLanguage,
      page,
      limit: 3,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedAppearancePartTypes[] =
      [];
    const appearancePartMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedAppearancePartTypes;
    } = {};

    translatedAppearancePart?.results.forEach((tc) => {
      const appearancePartId = tc.appearancePartId;
      if (!appearancePartMap[appearancePartId]) {
        appearancePartMap[appearancePartId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        appearancePartMap[appearancePartId].translated = tc;
      }
    });

    nonTranslatedAppearancePart?.results.forEach((ntc) => {
      const appearancePartId = ntc.appearancePartId;
      if (!appearancePartMap[appearancePartId]) {
        appearancePartMap[appearancePartId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        appearancePartMap[appearancePartId].nonTranslated = ntc;
      }
    });

    Object.values(appearancePartMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedAppearancePart, nonTranslatedAppearancePart]);

  return (
    <>
      {memoizedCombinedTranslations.length ? (
        <main
          className={`grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[1rem] w-full`}
        >
          {memoizedCombinedTranslations.map((ct, i) => (
            <DisplayTranslatedNonTranslatedAppearancePart
              key={(ct.translated?._id || i) + "-ctAppearancePart"}
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
