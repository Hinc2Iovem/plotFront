import { useEffect, useRef, useState } from "react";
import useGetTranslationStoriesSearch from "../../../../../hooks/Fetching/Translation/Story/useGetTranslationStoriesSearch";
import useOutOfModal from "../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import { TranslationStoryTypes } from "../../../../../types/Additional/TranslationTypes";
import CheckForCompletenessCharacter from "./CheckForCompletenessCharacter";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import CheckForCompletenessCharacteristic from "./CheckForCompletenessCharacteristic";
import CheckForCompletenessSeason from "./CheckForCompletenessSeason";

type StoryPromptTypes = {
  setStoryId: React.Dispatch<React.SetStateAction<string>>;
  setPrevStoryId?: React.Dispatch<React.SetStateAction<string>>;
  setSeasonValue?: React.Dispatch<React.SetStateAction<string>>;
  currentTranslationView?: CurrentTranslationViewTypes;
  characterType?: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  prevStoryId?: string;
};

export type CurrentTranslationViewTypes =
  | "character"
  | "appearancePart"
  | "characteristic"
  | "episode"
  | "season";

export default function StoryPrompt({
  setStoryId,
  setPrevStoryId,
  setSeasonValue,
  currentTranslationView,
  characterType,
  currentLanguage,
  translateToLanguage,
  prevStoryId,
}: StoryPromptTypes) {
  const [showStories, setShowStories] = useState(false);
  const modalStoriesRef = useRef<HTMLDivElement>(null);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const [storyValue, setStoryValue] = useState("");
  const [storyBackupValue, setStoryBackupValue] = useState("");

  useOutOfModal({
    modalRef: modalStoriesRef,
    setShowModal: setShowStories,
    showModal: showStories,
  });

  const debouncedValue = useDebounce({ value: storyValue, delay: 500 });

  const { data: allStories, isLoading } = useGetTranslationStoriesSearch({
    language: "russian",
    debouncedValue,
  });

  useEffect(() => {
    if (storyInputRef.current) {
      storyInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!showStories && !storyValue && storyBackupValue) {
      setStoryValue(storyBackupValue);
    }
  }, [showStories, storyValue, storyBackupValue]);

  return (
    <form
      className="bg-secondary rounded-md shadow-sm relative"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        ref={storyInputRef}
        className="w-full rounded-md shadow-md bg-secondary text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
        placeholder="История"
        onClick={(e) => {
          e.stopPropagation();
          if (storyValue?.trim().length) {
            setStoryBackupValue(storyValue);
          }
          setStoryValue("");
          setShowStories(true);
        }}
        value={storyValue}
        onChange={(e) => {
          if (!showStories) {
            setShowStories(true);
          }
          setStoryValue(e.target.value);
        }}
      />
      <aside
        ref={modalStoriesRef}
        className={`${
          showStories ? "" : "hidden"
        } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
      >
        {(allStories?.length || 0) > 0 && !isLoading ? (
          allStories?.map((s, i) => (
            <StoryPromptButton
              key={s._id || i + "story"}
              setShowStories={setShowStories}
              setStoryId={setStoryId}
              setStoryValue={setStoryValue}
              characterType={characterType}
              currentLanguage={currentLanguage}
              translateToLanguage={translateToLanguage}
              currentTranslationView={currentTranslationView || null}
              setPrevStoryId={setPrevStoryId}
              setSeasonValue={setSeasonValue}
              prevStoryId={prevStoryId}
              {...s}
            />
          ))
        ) : isLoading ? (
          <button
            type="button"
            onClick={() => {
              setShowStories(false);
            }}
            className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
          >
            Загрузка...
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowStories(false);
            }}
            className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
          >
            Нету Подходящих Историй
          </button>
        )}
      </aside>
    </form>
  );
}

type StoryPromptButtonTypes = {
  setStoryId: React.Dispatch<React.SetStateAction<string>>;
  setStoryValue: React.Dispatch<React.SetStateAction<string>>;
  setPrevStoryId?: React.Dispatch<React.SetStateAction<string>>;
  setShowStories: React.Dispatch<React.SetStateAction<boolean>>;
  setSeasonValue?: React.Dispatch<React.SetStateAction<string>>;
  currentTranslationView: CurrentTranslationViewTypes | null;
  characterType?: string;
  prevStoryId?: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
} & TranslationStoryTypes;

function StoryPromptButton({
  storyId,
  translations,
  setShowStories,
  setStoryId,
  setPrevStoryId,
  setStoryValue,
  setSeasonValue,
  currentTranslationView,
  characterType,
  currentLanguage,
  translateToLanguage,
  prevStoryId,
}: StoryPromptButtonTypes) {
  const [storyTitle] = useState(
    translations.find((t) => t.textFieldName === "storyName")?.text || ""
  );

  return (
    <button
      type="button"
      onClick={() => {
        setStoryId(storyId);
        if (setPrevStoryId) {
          setPrevStoryId(storyId);
        }
        if (prevStoryId !== storyId && setSeasonValue) {
          setSeasonValue("");
        }
        setStoryValue(storyTitle);
        setShowStories(false);
      }}
      className="text-[1.4rem] focus-within:bg-primary-darker transition-all focus-within:text-text-dark outline-none text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md relative"
    >
      {storyTitle}
      {currentLanguage && translateToLanguage ? (
        <>
          {currentTranslationView === "character" ? (
            <CheckForCompletenessCharacter
              storyId={storyId}
              characterType={characterType}
              currentLanguage={currentLanguage}
              translateToLanguage={translateToLanguage}
            />
          ) : currentTranslationView === "characteristic" ? (
            <CheckForCompletenessCharacteristic
              storyId={storyId}
              currentLanguage={currentLanguage}
              translateToLanguage={translateToLanguage}
            />
          ) : currentTranslationView === "season" ? (
            <CheckForCompletenessSeason
              storyId={storyId}
              currentLanguage={currentLanguage}
              translateToLanguage={translateToLanguage}
            />
          ) : null}
        </>
      ) : null}
    </button>
  );
}
