import { useEffect, useState } from "react";
import useUpdateSeasonTranslation from "../../../../../../hooks/Patching/Translation/useUpdateSeasonTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../../../../types/Additional/TranslationTypes";

type DisplayTranslatedNonTranslatedSeasonTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translated: TranslationSeasonTypes | null;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  nonTranslated: TranslationSeasonTypes | null;
  currentIndex: number;
  lastIndex: number;
};

export default function DisplayTranslatedNonTranslatedSeason({
  nonTranslated,
  translated,
  languageToTranslate,
  translateFromLanguage,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedSeasonTypes) {
  const [translatedBackUpSeasonName, setTranslatedBackUpSeasonName] =
    useState("");
  const [translatedSeasonName, setTranslatedSeasonName] = useState("");

  const [backUpSeasonName, setBackUpSeasonName] = useState("");
  const [seasonName, setSeasonName] = useState("");

  const [seasonId, setSeasonId] = useState("");

  useEffect(() => {
    if (translated) {
      setSeasonId(translated.seasonId);
      setTranslatedSeasonName(translated.translations[0]?.text || "");
      setTranslatedBackUpSeasonName(translated.translations[0]?.text || "");
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      setSeasonName(nonTranslated.translations[0]?.text || "");
      setBackUpSeasonName(nonTranslated.translations[0]?.text || "");
    } else {
      setSeasonName("");
      setBackUpSeasonName("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedTranslatedName = useDebounce({
    value: translatedSeasonName,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateSeasonTranslation({
    language: translateFromLanguage,
    storyId: translated?.storyId || nonTranslated?.storyId || "",
    seasonId: seasonId || nonTranslated?.seasonId || "",
  });

  useEffect(() => {
    if (
      debouncedTranslatedName !== translatedBackUpSeasonName &&
      debouncedTranslatedName?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        seasonName: debouncedTranslatedName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedName]);

  const debouncedName = useDebounce({
    value: seasonName,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateSeasonTranslation({
    language: languageToTranslate,
    storyId: translated?.storyId || nonTranslated?.storyId || "",
    seasonId: seasonId || nonTranslated?.seasonId || "",
  });

  useEffect(() => {
    if (debouncedName !== backUpSeasonName && debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        seasonName: debouncedName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <div
      className={`${
        currentIndex === lastIndex ? "col-span-full" : ""
      } flex-col h-fit w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full overflow-auto rounded-md shadow-md shadow-gray-400 bg-white`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedSeasonName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedSeasonName(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full overflow-auto rounded-md shadow-md shadow-gray-400 bg-white`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={seasonName}
            placeholder="Тайтл Сезона"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setSeasonName(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
