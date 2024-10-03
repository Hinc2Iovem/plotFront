import { useMemo, useState } from "react";
import useGetPaginatedTranslationCharacter from "../../../../../hooks/Fetching/Translation/Characters/useGetPaginatedTranslationCharacter";
import useInvalidateTranslatorCharacterQueries from "../../../../../hooks/helpers/Profile/Translator/useInvalidateTranslatorCharacterQueries";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../../types/Additional/TranslationTypes";
import StoryPrompt from "../../InputPrompts/StoryPrompt/StoryPrompt";
import CharacterTypesDropDown from "../Display/Character/CharacterTypesDropDown";
import DisplayTranslatedNonTranslatedCharacter from "../Display/Character/DisplayTranslatedNonTranslatedCharacter";

type FiltersEverythingCharacterForCharacterTypes = {
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateFromLanguage: CurrentlyAvailableLanguagesTypes;
  prevTranslateToLanguage: CurrentlyAvailableLanguagesTypes;
};

export type CombinedTranslatedAndNonTranslatedCharacterTypes = {
  translated: TranslationCharacterTypes | null;
  nonTranslated: TranslationCharacterTypes | null;
};

export default function FiltersEverythingCharacterForCharacter({
  translateFromLanguage,
  translateToLanguage,
  prevTranslateFromLanguage,
  prevTranslateToLanguage,
}: FiltersEverythingCharacterForCharacterTypes) {
  const [storyId, setStoryId] = useState("");
  const [page, setPage] = useState(1);
  const [characterTypeRus, setCharacterTypeRus] = useState("");
  const [characterTypeEng, setCharacterTypeEng] = useState("");
  console.log(setPage);

  useInvalidateTranslatorCharacterQueries({
    prevTranslateFromLanguage,
    prevTranslateToLanguage,
    storyId,
    translateToLanguage,
    limit: 3,
    page,
    characterType: characterTypeEng,
  });

  const { data: translatedCharacters } = useGetPaginatedTranslationCharacter({
    storyId,
    language: translateFromLanguage,
    characterType: characterTypeEng,
    limit: 3,
    page,
  });

  const { data: nonTranslatedCharacters } = useGetPaginatedTranslationCharacter(
    {
      storyId,
      language: translateToLanguage,
      characterType: characterTypeEng,
      limit: 3,
      page,
    }
  );

  const memoizedCombinedTranslations = useMemo(() => {
    const combinedArray: CombinedTranslatedAndNonTranslatedCharacterTypes[] =
      [];
    const characterMap: {
      [key: string]: CombinedTranslatedAndNonTranslatedCharacterTypes;
    } = {};

    translatedCharacters?.results.forEach((tc) => {
      const characterId = tc.characterId;
      if (!characterMap[characterId]) {
        characterMap[characterId] = {
          translated: tc,
          nonTranslated: null,
        };
      } else {
        characterMap[characterId].translated = tc;
      }
    });

    nonTranslatedCharacters?.results.forEach((ntc) => {
      const characterId = ntc.characterId;
      if (!characterMap[characterId]) {
        characterMap[characterId] = {
          translated: null,
          nonTranslated: ntc,
        };
      } else {
        characterMap[characterId].nonTranslated = ntc;
      }
    });

    Object.values(characterMap).forEach((entry) => {
      combinedArray.push(entry);
    });

    return combinedArray;
  }, [translatedCharacters, nonTranslatedCharacters]);

  return (
    <>
      <div className="flex w-full gap-[1rem] bg-neutral-alabaster px-[.5rem] py-[.5rem] rounded-md shadow-sm">
        <StoryPrompt
          setStoryId={setStoryId}
          characterType={characterTypeEng}
          currentTranslationView={"character"}
          currentLanguage={translateFromLanguage}
          translateToLanguage={translateToLanguage}
        />
        <CharacterTypesDropDown
          setCharacterTypeRus={setCharacterTypeRus}
          setCharacterTypeEng={setCharacterTypeEng}
          characterType={characterTypeRus}
        />
      </div>
      <main
        className={`grid ${
          characterTypeRus === "Обычный Персонаж" ||
          characterTypeRus === "Главный Персонаж"
            ? "grid-cols-[repeat(auto-fill,minmax(25rem,1fr))]"
            : "grid-cols-[repeat(auto-fill,minmax(30rem,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(50rem,1fr))]"
        } gap-[1rem] w-full`}
      >
        {memoizedCombinedTranslations.map((ct, i) => {
          return (
            <DisplayTranslatedNonTranslatedCharacter
              key={(ct?.translated?._id || i) + "-ct"}
              characterTypeFilter={characterTypeRus}
              translateFromLanguage={translateFromLanguage}
              languageToTranslate={translateToLanguage}
              {...ct}
            />
          );
        })}
      </main>
    </>
  );
}
