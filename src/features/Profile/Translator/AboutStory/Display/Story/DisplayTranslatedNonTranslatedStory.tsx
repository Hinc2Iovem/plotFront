import { useEffect, useState } from "react";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { CombinedTranslatedAndNonTranslatedStoryTypes } from "../../Filters/FiltersEverythingStoryForStory";
import useUpdateStoryTranslation from "../../../../../../hooks/Patching/Translation/useUpdateStoryTranslation";
import "../../../../../Editor/Flowchart/FlowchartStyles.css";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationTextFieldNameStoryTypes } from "../../../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type DisplayTranslatedNonTranslatedStoryTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  currentIndex: number;
  lastIndex: number;
} & CombinedTranslatedAndNonTranslatedStoryTypes;

export default function DisplayTranslatedNonTranslatedStory({
  nonTranslated,
  translated,
  languageToTranslate,
  translateFromLanguage,
  currentIndex,
  lastIndex,
}: DisplayTranslatedNonTranslatedStoryTypes) {
  const [translatedBackUpStoryName, setTranslatedBackUpStoryName] =
    useState("");
  const [
    translatedBackUpStoryDescription,
    setTranslatedBackUpStoryDescription,
  ] = useState("");
  const [translatedBackUpStoryGenre, setTranslatedBackUpStoryGenre] =
    useState("");
  const [translatedStoryName, setTranslatedStoryName] = useState("");
  const [translatedStoryDescription, setTranslatedStoryDescription] =
    useState("");
  const [translatedStoryGenre, setTranslatedStoryGenre] = useState("");

  const [backUpStoryName, setBackUpStoryName] = useState("");
  const [backUpStoryGenre, setBackUpStoryGenre] = useState("");
  const [backUpStoryDescription, setBackUpStoryDescription] = useState("");
  const [storyName, setStoryName] = useState("");
  const [storyGenre, setStoryGenre] = useState("");
  const [storyDescription, setStoryDescription] = useState("");

  const [storyId, setStoryId] = useState("");

  useEffect(() => {
    if (translated) {
      setStoryId(translated.storyId);
      translated.translations.map((t) => {
        if (t.textFieldName === "storyName") {
          setTranslatedStoryName(t.text);
          setTranslatedBackUpStoryName(t.text);
        } else if (t.textFieldName === "storyDescription") {
          setTranslatedStoryDescription(t.text);
          setTranslatedBackUpStoryDescription(t.text);
        } else if (t.textFieldName === "storyGenre") {
          setTranslatedStoryGenre(t.text);
          setTranslatedBackUpStoryGenre(t.text);
        }
      });
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      nonTranslated.translations.map((nt) => {
        if (nt.textFieldName === "storyName") {
          setStoryName(nt.text);
          setBackUpStoryName(nt.text);
        } else if (nt.textFieldName === "storyDescription") {
          setStoryDescription(nt.text);
          setBackUpStoryDescription(nt.text);
        } else if (nt.textFieldName === "storyGenre") {
          setStoryGenre(nt.text);
          setBackUpStoryGenre(nt.text);
        }
      });
    } else {
      setStoryDescription("");
      setStoryName("");
      setStoryGenre("");
      setBackUpStoryDescription("");
      setBackUpStoryName("");
      setBackUpStoryGenre("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedTranslatedName = useDebounce({
    value: translatedStoryName,
    delay: 500,
  });

  const debouncedTranslatedDescription = useDebounce({
    value: translatedStoryDescription,
    delay: 500,
  });
  const debouncedTranslatedGenre = useDebounce({
    value: translatedStoryGenre,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateStoryTranslation({
    language: translateFromLanguage,
    storyId: storyId || nonTranslated?.storyId || "",
  });

  useEffect(() => {
    if (
      debouncedTranslatedName !== translatedBackUpStoryName &&
      debouncedTranslatedName?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedTranslatedName,
        textFieldName:
          TranslationTextFieldName.StoryName as TranslationTextFieldNameStoryTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedName]);
  useEffect(() => {
    if (
      debouncedTranslatedGenre !== translatedBackUpStoryGenre &&
      debouncedTranslatedGenre?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedTranslatedGenre,
        textFieldName:
          TranslationTextFieldName.StoryGenre as TranslationTextFieldNameStoryTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedGenre]);
  useEffect(() => {
    if (
      debouncedTranslatedDescription !== translatedBackUpStoryDescription &&
      debouncedTranslatedDescription?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedTranslatedDescription,
        textFieldName:
          TranslationTextFieldName.StoryDescription as TranslationTextFieldNameStoryTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedDescription]);

  const debouncedName = useDebounce({
    value: storyName,
    delay: 500,
  });

  const debouncedDescription = useDebounce({
    value: storyDescription,
    delay: 500,
  });
  const debouncedGenre = useDebounce({
    value: storyGenre,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateStoryTranslation({
    language: languageToTranslate,
    storyId: storyId || nonTranslated?.storyId || "",
  });

  useEffect(() => {
    if (debouncedName !== backUpStoryName && debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedName,
        textFieldName:
          TranslationTextFieldName.StoryName as TranslationTextFieldNameStoryTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);
  useEffect(() => {
    if (debouncedGenre !== backUpStoryGenre && debouncedGenre?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedGenre,
        textFieldName:
          TranslationTextFieldName.StoryGenre as TranslationTextFieldNameStoryTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGenre]);

  useEffect(() => {
    if (
      debouncedDescription !== backUpStoryDescription &&
      debouncedDescription?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        text: debouncedDescription,
        textFieldName:
          TranslationTextFieldName.StoryDescription as TranslationTextFieldNameStoryTypes,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  return (
    <div
      className={`${
        currentIndex === lastIndex ? "col-span-full" : ""
      } sm:h-[17.5rem] h-[35rem] sm:flex-row flex-col w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full sm:w-[calc(50%)] overflow-auto rounded-md shadow-md shadow-gray-400 bg-white | containerScroll`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedStoryName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedStoryName(e.target.value)}
          />
          <input
            type="text"
            value={translatedStoryGenre}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedStoryGenre(e.target.value)}
          />
          <textarea
            name="TranslatedDescription"
            id="translatedDescription"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white | containerScroll"
            value={translatedStoryDescription}
            onChange={(e) => setTranslatedStoryDescription(e.target.value)}
          />
        </form>
      </div>
      <div
        className={`h-full w-full sm:w-[calc(50%)] overflow-auto rounded-md shadow-md shadow-gray-400 bg-white | containerScroll`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={storyName}
            placeholder="Тайтл Истории"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setStoryName(e.target.value)}
          />
          <input
            type="text"
            value={storyGenre}
            placeholder="Жанры Истории"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setStoryGenre(e.target.value)}
          />
          <textarea
            name="Description"
            id="description"
            placeholder="Описание Истории"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white | containerScroll"
            value={storyDescription}
            onChange={(e) => setStoryDescription(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
