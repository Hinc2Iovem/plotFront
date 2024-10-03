import { useMemo, useState } from "react";
import useGetPaginatedTranslationCharacteristics from "../../../../../hooks/Fetching/Translation/Characteristic/useGetPaginatedTranslationCharacteristics";
import useInvalidateTranslatorCharacteristicQueries from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorCharacteristicQueries";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../../types/Additional/TranslationTypes";
import StoryPrompt from "../../InputPrompts/StoryPrompt/StoryPrompt";
import DisplayTranslatedNonTranslatedCharacteristic from "../Display/Characteristic/DisplayTranslatedNonTranslatedCharacteristic";

type FiltersEverythingCharacterForCharacteristicTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export type CombinedTranslatedAndNonTranslatedCharacteristicTypes = {
  translated: TranslationCharacterCharacteristicTypes | null;
  nonTranslated: TranslationCharacterCharacteristicTypes | null;
};

export default function FiltersEverythingCharacterForCharacteristic({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
}: FiltersEverythingCharacterForCharacteristicTypes) {
  const [page, setPage] = useState(1);
  const [storyId, setStoryId] = useState("");
  console.log(setPage);

  useInvalidateTranslatorCharacteristicQueries({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    translateToLanguage,
    storyId,
    limit: 3,
    page,
  });

  const { data: translatedCharacteristics } =
    useGetPaginatedTranslationCharacteristics({
      storyId,
      language: translateFromLanguage,
      page,
      limit: 3,
    });
  const { data: nonTranslatedCharacteristics } =
    useGetPaginatedTranslationCharacteristics({
      storyId,
      language: translateToLanguage,
      page,
      limit: 3,
    });

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedCharacteristicTypes[] =
      [];
    const characteristicMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedCharacteristicTypes;
    } = {};

    translatedCharacteristics?.results.forEach((tc) => {
      const characteristicId = tc.characteristicId;
      if (!characteristicMap[characteristicId]) {
        characteristicMap[characteristicId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        characteristicMap[characteristicId].translated = tc;
      }
    });

    nonTranslatedCharacteristics?.results.forEach((ntc) => {
      const characteristicId = ntc.characteristicId;
      if (!characteristicMap[characteristicId]) {
        characteristicMap[characteristicId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        characteristicMap[characteristicId].nonTranslated = ntc;
      }
    });

    Object.values(characteristicMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedCharacteristics, nonTranslatedCharacteristics]);

  return (
    <>
      <div className="flex w-full gap-[1rem] bg-neutral-alabaster px-[.5rem] py-[.5rem] rounded-md shadow-sm">
        <StoryPrompt
          setStoryId={setStoryId}
          currentLanguage={translateFromLanguage}
          currentTranslationView={"characteristic"}
          translateToLanguage={translateToLanguage}
        />
      </div>
      <main
        className={`grid grid-cols-[repeat(auto-fit,minmax(25rem,1fr))] gap-[1rem] w-full`}
      >
        {memoizedCombinedTranslations?.map((ct, i) => (
          <DisplayTranslatedNonTranslatedCharacteristic
            key={(ct?.translated?._id || i) + "-ctCharacteristic"}
            languageToTranslate={translateToLanguage}
            currentIndex={i}
            lastIndex={memoizedCombinedTranslations.length - 1}
            translateFromLanguage={translateFromLanguage}
            {...ct}
          />
        ))}
      </main>
    </>
  );
}
