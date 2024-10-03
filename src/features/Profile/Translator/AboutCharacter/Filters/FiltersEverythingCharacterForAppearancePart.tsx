import { useMemo, useState } from "react";
import useGetPaginatedTranslationAppearanceParts from "../../../../../hooks/Fetching/Translation/AppearancePart/useGetPaginatedTranslationAppearanceParts";
import useInvalidateTranslatorAppearancePartsQueries from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorAppearancePartsQueries";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../../types/Additional/TranslationTypes";
import CharacterPrompt from "../../InputPrompts/CharacterPrompt/CharacterPrompt";
import AppearanceTypeDropDown from "../Display/AppearancePart/AppearanceTypeDropDown";
import DisplayTranslatedNonTranslatedAppearancePart from "../Display/AppearancePart/DisplayTranslatedNonTranslatedAppearancePart";
import StoryPrompt from "../../InputPrompts/StoryPrompt/StoryPrompt";

type FiltersEverythingCharacterForAppearancePartTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export type CombinedTranslatedAndNonTranslatedAppearancePartTypes = {
  translated: TranslationAppearancePartTypes | null;
  nonTranslated: TranslationAppearancePartTypes | null;
};

export default function FiltersEverythingCharacterForAppearancePart({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
}: FiltersEverythingCharacterForAppearancePartTypes) {
  const [characterId, setCharacterId] = useState("");
  const [storyId, setStoryId] = useState("");
  const [page, setPage] = useState(1);
  const [appearanceType, setAppearanceType] = useState(
    "" as TranslationTextFieldNameAppearancePartsTypes
  );
  console.log(setPage);

  useInvalidateTranslatorAppearancePartsQueries({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    characterId,
    type: appearanceType,
    limit: 3,
    page,
  });

  const { data: translatedAppearancePart } =
    useGetPaginatedTranslationAppearanceParts({
      characterId,
      language: translateFromLanguage,
      type: appearanceType,
      page,
      limit: 3,
    });

  const { data: nonTranslatedAppearancePart } =
    useGetPaginatedTranslationAppearanceParts({
      characterId,
      language: translateToLanguage,
      type: appearanceType,
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
      <div className="flex w-full gap-[1rem] bg-neutral-alabaster px-[.5rem] py-[.5rem] rounded-md shadow-sm">
        <StoryPrompt
          setStoryId={setStoryId}
          currentLanguage={translateFromLanguage}
          currentTranslationView={"appearancePart"}
          translateToLanguage={translateToLanguage}
        />
        <CharacterPrompt
          storyId={storyId}
          setCharacterId={setCharacterId}
          characterId={characterId}
          currentLanguage={translateFromLanguage}
          currentTranslationView={"appearancePart"}
          translateToLanguage={translateToLanguage}
          appearancePartVariation={appearanceType}
        />
        <AppearanceTypeDropDown setAppearanceType={setAppearanceType} />
      </div>
      <main
        className={`grid grid-cols-[repeat(auto-fill,minmax(25rem,1fr))] gap-[1rem] w-full`}
      >
        {memoizedCombinedTranslations.map((ct, i) => (
          <DisplayTranslatedNonTranslatedAppearancePart
            key={(ct.translated?._id || i) + "-ctAppearancePart"}
            filteredAppearanceType={appearanceType}
            currentIndex={i}
            lastIndex={memoizedCombinedTranslations.length - 1}
            languageToTranslate={translateToLanguage}
            translateFromLanguage={translateFromLanguage}
            {...ct}
          />
        ))}
      </main>
    </>
  );
}
