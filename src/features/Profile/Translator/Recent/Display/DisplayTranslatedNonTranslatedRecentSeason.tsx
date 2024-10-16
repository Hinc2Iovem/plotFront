import { useEffect, useState } from "react";
import useGetTranslationSeason from "../../../../../hooks/Fetching/Translation/useGetTranslationSeason";
import useUpdateSeasonTranslation from "../../../../../hooks/Patching/Translation/useUpdateSeasonTranslation";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../../../types/Additional/TranslationTypes";
import "../../../../Editor/Flowchart/FlowchartStyles.css";

type DisplayTranslatedNonTranslatedSeasonTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translated: TranslationSeasonTypes;
};

export default function DisplayTranslatedNonTranslatedRecentSeason({
  translated,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedSeasonTypes) {
  const [translatedSeasonName, setTranslatedSeasonName] = useState("");
  const [seasonName, setSeasonName] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [storyId, setStoryId] = useState("");

  useEffect(() => {
    if (translated) {
      if (translated.seasonId) {
        setSeasonId(translated.seasonId);
      }
      if (translated.storyId) {
        setStoryId(translated.storyId);
      }
      if (translated.translations[0]?.textFieldName === "seasonName") {
        setTranslatedSeasonName(translated.translations[0]?.text);
      }
    }
  }, [translated]);

  const { data: nonTranslatedSeason } = useGetTranslationSeason({
    seasonId,
    language: languageToTranslate,
  });

  useEffect(() => {
    if (nonTranslatedSeason) {
      if (nonTranslatedSeason.translations[0]?.textFieldName === "seasonName") {
        setSeasonName(nonTranslatedSeason.translations[0]?.text);
      }
      if (nonTranslatedSeason.storyId) {
        setStoryId(nonTranslatedSeason.storyId);
      }
    } else {
      setSeasonName("");
    }
  }, [nonTranslatedSeason, languageToTranslate]);

  const debouncedNameTranslated = useDebounce({
    value: translatedSeasonName,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateSeasonTranslation({
    language: translateFromLanguage,
    seasonId,
    storyId,
  });

  useEffect(() => {
    if (debouncedNameTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        seasonName: debouncedNameTranslated,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

  const debouncedName = useDebounce({
    value: seasonName,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateSeasonTranslation({
    language: languageToTranslate,
    seasonId,
    storyId,
  });

  useEffect(() => {
    if (debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        seasonName: debouncedName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <div
      className={`flex-col h-fit w-full flex gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full overflow-auto rounded-md shadow-md shadow-gray-400 bg-secondary`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedSeasonName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setTranslatedSeasonName(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full overflow-auto rounded-md shadow-md shadow-gray-400 bg-secondary`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={seasonName}
            placeholder="Тайтл Сезона"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setSeasonName(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
