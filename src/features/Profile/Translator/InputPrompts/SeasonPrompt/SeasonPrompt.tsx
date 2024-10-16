import { useEffect, useRef, useState } from "react";
import useGetSeasonTranslationsByStoryIdAndSearch from "../../../../../hooks/Fetching/Translation/Season/useGetSeasonTranslationsByStoryIdAndSearch";
import useOutOfModal from "../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import CheckForCompletenessEpisode from "./CheckForCompletenessEpisode";

type SeasonPromptTypes = {
  setSeasonId: React.Dispatch<React.SetStateAction<string>>;
  storyId: string;
  currentLanguage?: CurrentlyAvailableLanguagesTypes;
  translateToLanguage?: CurrentlyAvailableLanguagesTypes;
  setSeasonValue?: React.Dispatch<React.SetStateAction<string>>;
  seasonValue?: string;
  currentTranslationView?: "episode";
};

export default function SeasonPrompt({
  setSeasonId,
  storyId,
  currentLanguage,
  translateToLanguage,
  seasonValue,
  currentTranslationView,
  setSeasonValue,
}: SeasonPromptTypes) {
  const [showSeasons, setShowSeasons] = useState(false);
  const [seasonBackupValue, setSeasonBackupValue] = useState("");
  const modalSeasonsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedValue = useDebounce({ value: seasonValue || "", delay: 500 });

  const { data: seasonsSearch, isLoading } =
    useGetSeasonTranslationsByStoryIdAndSearch({
      debouncedValue,
      language: "russian",
      storyId,
    });

  useEffect(() => {
    if (!showSeasons && !seasonValue && seasonBackupValue && setSeasonValue) {
      setSeasonValue(seasonBackupValue);
    }
  }, [showSeasons, seasonValue, seasonBackupValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonValue?.trim().length) {
      console.log("Заполните Поле");
      return;
    }
    setSeasonId(
      seasonsSearch?.find((cs) => cs.translations[0]?.text === seasonValue)
        ?.seasonId || ""
    );
    setShowSeasons(false);
    inputRef?.current?.blur();
  };

  useOutOfModal({
    modalRef: modalSeasonsRef,
    setShowModal: setShowSeasons,
    showModal: showSeasons,
  });

  return (
    <form
      className="bg-secondary rounded-md shadow-sm relative"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        ref={inputRef}
        className="w-full rounded-md shadow-md bg-secondary text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
        placeholder="Название Сезона"
        onClick={(e) => {
          e.stopPropagation();
          if (seasonValue?.trim().length) {
            setSeasonBackupValue(seasonValue);
          }
          if (setSeasonValue) {
            setSeasonValue("");
          }
          setShowSeasons(true);
        }}
        value={seasonValue}
        onChange={(e) => {
          if (setSeasonValue) {
            setSeasonValue(e.target.value);
          }
        }}
      />
      {storyId ? (
        <aside
          ref={modalSeasonsRef}
          className={`${
            showSeasons ? "" : "hidden"
          } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
        >
          {isLoading ? (
            <div className="text-[1.4rem] text-gray-600 text-center py-[.5rem]">
              Загрузка...
            </div>
          ) : seasonsSearch && seasonsSearch.length > 0 ? (
            seasonsSearch.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => {
                  setSeasonId(s.seasonId);
                  if (setSeasonValue) {
                    setSeasonValue(s.translations[0]?.text || "");
                  }
                  setShowSeasons(false);
                }}
                className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md relative"
              >
                {s.translations[0]?.text || ""}
                {currentLanguage && translateToLanguage ? (
                  <>
                    {currentTranslationView === "episode" ? (
                      <CheckForCompletenessEpisode
                        seasonId={s.seasonId}
                        currentLanguage={currentLanguage}
                        translateToLanguage={translateToLanguage}
                      />
                    ) : null}
                  </>
                ) : null}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowSeasons(false);
              }}
              className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
            >
              Нету Подходящих Сезонов
            </button>
          )}
        </aside>
      ) : (
        <aside
          ref={modalSeasonsRef}
          className={`${
            showSeasons ? "" : "hidden"
          } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
        >
          <button
            type="button"
            onClick={() => {
              setShowSeasons(false);
            }}
            className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
          >
            Выберите Историю
          </button>
        </aside>
      )}
    </form>
  );
}
