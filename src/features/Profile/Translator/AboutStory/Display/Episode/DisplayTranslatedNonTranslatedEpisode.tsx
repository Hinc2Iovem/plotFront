import { useEffect, useState } from "react";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateEpisodeTranslation from "../../../../../../hooks/Patching/Translation/useUpdateEpisodeTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameEpisodeTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { CombinedTranslatedAndNonTranslatedEpisodeTypes } from "../../Filters/FiltersEverythingStoryForEpisode";
import "../../../../../Editor/Flowchart/FlowchartStyles.css";

type DisplayTranslatedNonTranslatedEpisodeTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  currentIndex: number;
  lastIndex: number;
} & CombinedTranslatedAndNonTranslatedEpisodeTypes;

export default function DisplayTranslatedNonTranslatedEpisode({
  nonTranslated,
  translated,
  languageToTranslate,
  translateFromLanguage,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedEpisodeTypes) {
  const [translatedBackUpEpisodeName, setTranslatedBackUpEpisodeName] =
    useState("");
  const [
    translatedBackUpEpisodeDescription,
    setTranslatedBackUpEpisodeDescription,
  ] = useState("");
  const [translatedEpisodeName, setTranslatedEpisodeName] = useState("");
  const [translatedEpisodeDescription, setTranslatedEpisodeDescription] =
    useState("");

  const [backUpEpisodeName, setBackUpEpisodeName] = useState("");
  const [backUpEpisodeDescription, setBackUpEpisodeDescription] = useState("");
  const [episodeName, setEpisodeName] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");
  const [episodeId, setEpisodeId] = useState("");

  useEffect(() => {
    if (translated) {
      setEpisodeId(translated.episodeId);
      translated.translations.map((tt) => {
        if (tt.textFieldName === "episodeName") {
          setTranslatedEpisodeName(tt.text);
          setTranslatedBackUpEpisodeName(tt.text);
        } else if (tt.textFieldName === "episodeDescription") {
          setTranslatedEpisodeDescription(tt.text);
          setTranslatedBackUpEpisodeDescription(tt.text);
        }
      });
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      nonTranslated.translations.map((nt) => {
        if (nt.textFieldName === "episodeName") {
          setEpisodeName(nt.text);
          setBackUpEpisodeName(nt.text);
        } else if (nt.textFieldName === "episodeDescription") {
          setEpisodeDescription(nt.text);
          setBackUpEpisodeDescription(nt.text);
        }
      });
    } else {
      setEpisodeName("");
      setEpisodeDescription("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedNameTranslated = useDebounce({
    value: translatedEpisodeName,
    delay: 500,
  });

  const debouncedDescriptionTranslated = useDebounce({
    value: translatedEpisodeDescription,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateEpisodeTranslation({
    language: translateFromLanguage,
    episodeId: episodeId || nonTranslated?.episodeId || "",
    seasonId: translated?.seasonId || nonTranslated?.seasonId || "",
  });

  useEffect(() => {
    if (
      debouncedNameTranslated !== translatedBackUpEpisodeName &&
      debouncedNameTranslated?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedNameTranslated,
        textFieldName:
          TranslationTextFieldName.EpisodeName as TranslationTextFieldNameEpisodeTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

  useEffect(() => {
    if (
      debouncedDescriptionTranslated !== translatedBackUpEpisodeDescription &&
      debouncedDescriptionTranslated?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedDescriptionTranslated,
        textFieldName:
          TranslationTextFieldName.EpisodeDescription as TranslationTextFieldNameEpisodeTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescriptionTranslated]);

  const debouncedName = useDebounce({
    value: episodeName,
    delay: 500,
  });

  const debouncedDescription = useDebounce({
    value: episodeDescription,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateEpisodeTranslation({
    language: languageToTranslate,
    episodeId: episodeId || nonTranslated?.episodeId || "",
    seasonId: translated?.seasonId || nonTranslated?.seasonId || "",
  });

  useEffect(() => {
    if (debouncedName !== backUpEpisodeName && debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedName,
        textFieldName:
          TranslationTextFieldName.EpisodeName as TranslationTextFieldNameEpisodeTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {
    if (
      debouncedDescription !== backUpEpisodeDescription &&
      debouncedDescription?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        text: debouncedDescription,
        textFieldName:
          TranslationTextFieldName.EpisodeDescription as TranslationTextFieldNameEpisodeTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  return (
    <div
      className={`${
        currentIndex === lastIndex ? "col-span-full" : ""
      } sm:h-[15rem] h-[25rem] sm:flex-row flex-col w-full flex gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full sm:w-[calc(50%)] overflow-auto rounded-md shadow-md shadow-gray-400 bg-secondary | containerScroll`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedEpisodeName}
            placeholder="Тайтл Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setTranslatedEpisodeName(e.target.value)}
          />
          <textarea
            name="TranslatedDescription"
            id="translatedDescription"
            placeholder="Описание Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            value={translatedEpisodeDescription}
            onChange={(e) => setTranslatedEpisodeDescription(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full sm:w-[calc(50%)] overflow-auto rounded-md shadow-md shadow-gray-400 bg-secondary | containerScroll`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={episodeName}
            placeholder="Тайтл Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setEpisodeName(e.target.value)}
          />
          <textarea
            name="Description"
            id="description"
            placeholder="Описание Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            value={episodeDescription}
            onChange={(e) => setEpisodeDescription(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
