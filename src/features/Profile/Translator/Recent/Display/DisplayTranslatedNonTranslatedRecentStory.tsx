import { useEffect, useState } from "react";
import "../../../../Editor/Flowchart/FlowchartStyles.css";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../../../types/Additional/TranslationTypes";
import useGetTranslationStory from "../../../../../hooks/Fetching/Translation/useGetTranslationStory";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import useUpdateStoryTranslation from "../../../../../hooks/Patching/Translation/useUpdateStoryTranslation";

type DisplayTranslatedNonTranslatedRecentStoryTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translated: TranslationStoryTypes[];
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function DisplayTranslatedNonTranslatedRecentStory({
  translated,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedRecentStoryTypes) {
  const [translatedStoryName, setTranslatedStoryName] = useState("");
  const [translatedStoryDescription, setTranslatedStoryDescription] =
    useState("");
  const [translatedStoryGenre, setTranslatedStoryGenre] = useState("");

  const [storyName, setStoryName] = useState("");
  const [storyGenre, setStoryGenre] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyId, setStoryId] = useState("");

  useEffect(() => {
    if (translated) {
      translated.map((t) => {
        setStoryId(t.storyId);
        t.translations.map((tt) => {
          if (tt.textFieldName === "storyName") {
            setTranslatedStoryName(tt.text);
          } else if (tt.textFieldName === "storyDescription") {
            setTranslatedStoryDescription(tt.text);
          } else if (tt.textFieldName === "storyGenre") {
            setTranslatedStoryGenre(tt.text);
          }
        });
      });
    }
  }, [translated]);

  const { data: nonTranslatedStory } = useGetTranslationStory({
    id: storyId,
    language: languageToTranslate,
  });

  useEffect(() => {
    if (nonTranslatedStory) {
      nonTranslatedStory.map((nt) => {
        nt.translations.map((ntt) => {
          if (ntt.textFieldName === "storyName") {
            setStoryName(ntt.text);
          } else if (ntt.textFieldName === "storyDescription") {
            setStoryDescription(ntt.text);
          } else if (ntt.textFieldName === "storyGenre") {
            setStoryGenre(ntt.text);
          }
        });
      });
    } else {
      setStoryName("");
      setStoryDescription("");
      setStoryGenre("");
    }
  }, [nonTranslatedStory, languageToTranslate]);

  const debouncedNameTranslated = useDebounce({
    value: translatedStoryName,
    delay: 500,
  });

  const debouncedDescriptionTranslated = useDebounce({
    value: translatedStoryDescription,
    delay: 500,
  });
  const debouncedGenreTranslated = useDebounce({
    value: translatedStoryGenre,
    delay: 500,
  });

  const updateCharacterTranslationTranslated = useUpdateStoryTranslation({
    language: translateFromLanguage,
    storyId,
  });

  useEffect(() => {
    if (debouncedNameTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedNameTranslated,
        textFieldName: "storyName",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);
  useEffect(() => {
    if (debouncedGenreTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedGenreTranslated,
        textFieldName: "storyGenre",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGenreTranslated]);

  useEffect(() => {
    if (debouncedDescriptionTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedDescriptionTranslated,
        textFieldName: "storyDescription",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescriptionTranslated]);

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
    storyId,
  });

  useEffect(() => {
    if (debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedName,
        textFieldName: "storyName",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);
  useEffect(() => {
    if (debouncedGenre?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedGenre,
        textFieldName: "storyGenre",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGenre]);

  useEffect(() => {
    if (debouncedDescription?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedDescription,
        textFieldName: "storyDescription",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  return (
    <div
      className={`sm:h-[20rem] h-[25rem] sm:flex-row flex-col w-full flex gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md`}
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
            value={translatedStoryName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setTranslatedStoryName(e.target.value)}
          />
          <input
            type="text"
            value={translatedStoryGenre}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setTranslatedStoryGenre(e.target.value)}
          />
          <textarea
            name="TranslatedDescription"
            id="translatedDescription"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary | containerScroll"
            value={translatedStoryDescription}
            onChange={(e) => setTranslatedStoryDescription(e.target.value)}
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
            value={storyName}
            placeholder="Тайтл Истории"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setStoryName(e.target.value)}
          />
          <input
            type="text"
            value={storyGenre}
            placeholder="Жанры Истории"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setStoryGenre(e.target.value)}
          />
          <textarea
            name="Description"
            id="description"
            placeholder="Описание Истории"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary | containerScroll"
            value={storyDescription}
            onChange={(e) => setStoryDescription(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
