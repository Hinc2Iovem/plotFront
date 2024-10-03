import { useEffect, useState } from "react";
import useGetTranslationEpisode from "../../../../../hooks/Fetching/Translation/useGetTranslationEpisode";
import useUpdateEpisodeTranslation from "../../../../../hooks/Patching/Translation/useUpdateEpisodeTranslation";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationEpisodeTypes } from "../../../../../types/Additional/TranslationTypes";
import "../../../../Editor/Flowchart/FlowchartStyles.css";

type DisplayTranslatedNonTranslatedRecentEpisodeTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translated: TranslationEpisodeTypes[];
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function DisplayTranslatedNonTranslatedRecentEpisode({
  translated,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedRecentEpisodeTypes) {
  const [translatedEpisodeName, setTranslatedEpisodeName] = useState("");
  const [translatedEpisodeDescription, setTranslatedEpisodeDescription] =
    useState("");

  const [episodeName, setEpisodeName] = useState("");
  const [episodeDescription, setEpisodeDescription] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [seasonId, setSeasonId] = useState("");

  useEffect(() => {
    if (translated) {
      translated.map((t) => {
        setEpisodeId(t.episodeId);
        if (t.seasonId) {
          setSeasonId(t.seasonId);
        }
        t.translations.map((tt) => {
          if (tt.textFieldName === "episodeName") {
            setTranslatedEpisodeName(tt.text);
          } else if (tt.textFieldName === "episodeDescription") {
            setTranslatedEpisodeDescription(tt.text);
          }
        });
      });
    }
  }, [translated]);

  const { data: nonTranslatedEpisode } = useGetTranslationEpisode({
    episodeId,
    language: languageToTranslate,
  });

  useEffect(() => {
    if (nonTranslatedEpisode) {
      if (nonTranslatedEpisode.seasonId) {
        setSeasonId(nonTranslatedEpisode.seasonId);
      }
      nonTranslatedEpisode.translations.map((nt) => {
        if (nt.textFieldName === "episodeName") {
          setEpisodeName(nt.text);
        } else if (nt.textFieldName === "episodeDescription") {
          setEpisodeDescription(nt.text);
        }
      });
    } else {
      setEpisodeDescription("");
      setEpisodeName("");
    }
  }, [nonTranslatedEpisode, languageToTranslate]);

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
    episodeId,
    seasonId,
  });

  useEffect(() => {
    if (debouncedNameTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedNameTranslated,
        textFieldName: "episodeName",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNameTranslated]);

  useEffect(() => {
    if (debouncedDescriptionTranslated?.trim().length) {
      updateCharacterTranslationTranslated.mutate({
        text: debouncedDescriptionTranslated,
        textFieldName: "episodeDescription",
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
    episodeId,
    seasonId,
  });

  useEffect(() => {
    if (debouncedName?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedName,
        textFieldName: "episodeName",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  useEffect(() => {
    if (debouncedDescription?.trim().length) {
      updateCharacterTranslation.mutate({
        text: debouncedDescription,
        textFieldName: "episodeDescription",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  return (
    <div
      className={`sm:h-[15rem] h-[25rem] sm:flex-row flex-col w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
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
            value={translatedEpisodeName}
            placeholder="Тайтл Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedEpisodeName(e.target.value)}
          />
          <textarea
            name="TranslatedDescription"
            id="translatedDescription"
            placeholder="Описание Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            value={translatedEpisodeDescription}
            onChange={(e) => setTranslatedEpisodeDescription(e.target.value)}
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
            value={episodeName}
            placeholder="Тайтл Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setEpisodeName(e.target.value)}
          />
          <textarea
            name="Description"
            id="description"
            placeholder="Описание Эпизода"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.4rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            value={episodeDescription}
            onChange={(e) => setEpisodeDescription(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
