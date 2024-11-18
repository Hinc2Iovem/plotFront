import { useEffect, useMemo, useRef, useState } from "react";
import useGetSeasonsByStoryId from "../../../../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import useOutOfModal from "../../../../../hooks/UI/useOutOfModal";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import AsideScrollable from "../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../shared/Inputs/PlotfieldInput";
import CheckForCompletenessEpisode from "./CheckForCompletenessEpisode";
import useDebounce from "../../../../../hooks/utilities/useDebounce";

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
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const { data: seasonsSearch, isLoading } = useGetSeasonsByStoryId({
    language: "russian",
    storyId,
  });

  const debouncedValue = useDebounce({ value: seasonValue || "", delay: 700 });

  const filteredSeasons = useMemo(() => {
    if (seasonsSearch) {
      if (seasonValue) {
        return seasonsSearch.filter((ss) =>
          ss.translations.filter(
            (sst) => sst.textFieldName === "seasonName" && sst.text.toLowerCase().includes(seasonValue.toLowerCase())
          )
        );
      } else {
        return seasonsSearch;
      }
    } else {
      return [];
    }
  }, [seasonsSearch, seasonValue]);

  useEffect(() => {
    if (!showSeasons && !seasonValue && seasonBackupValue && setSeasonValue) {
      setSeasonValue(seasonBackupValue);
    }
  }, [showSeasons, seasonValue, seasonBackupValue]);

  useEffect(() => {
    if (debouncedValue) {
      const matchedValue = seasonsSearch?.find((cs) =>
        cs?.translations?.some(
          (tct) => tct.textFieldName === "seasonName" && tct.text.toLowerCase() === debouncedValue.toLowerCase()
        )
      );
      if (matchedValue) {
        setSeasonId(matchedValue?.seasonId);
        if (setSeasonValue) {
          setSeasonValue(matchedValue?.translations[0]?.text);
        }
        setSeasonBackupValue(matchedValue?.translations[0]?.text);
      } else {
        setSeasonId("");
      }
    }
  }, [debouncedValue, seasonsSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonValue?.trim().length) {
      console.log("Заполните Поле");
      return;
    }
    setSeasonId(seasonsSearch?.find((cs) => cs.translations[0]?.text === seasonValue)?.seasonId || "");
    setShowSeasons(false);
    inputRef?.current?.blur();
  };

  useOutOfModal({
    modalRef: modalSeasonsRef,
    setShowModal: setShowSeasons,
    showModal: showSeasons,
  });

  return (
    <form className={`rounded-md shadow-sm relative`} onSubmit={handleSubmit}>
      <PlotfieldInput
        type="text"
        focusedSecondTime={focusedSecondTime}
        onBlur={() => {
          setFocusedSecondTime(false);
        }}
        setFocusedSecondTime={setFocusedSecondTime}
        ref={inputRef}
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
        <AsideScrollable ref={modalSeasonsRef} className={`${showSeasons ? "" : "hidden"} translate-y-[.5rem]`}>
          {isLoading ? (
            <div className="text-[1.4rem] text-gray-600 text-center py-[.5rem]">Загрузка...</div>
          ) : filteredSeasons && filteredSeasons.length > 0 ? (
            filteredSeasons.map((s) => (
              <AsideScrollableButton
                key={s._id}
                type="button"
                onClick={() => {
                  setSeasonId(s.seasonId);
                  if (setSeasonValue) {
                    setSeasonValue(s.translations[0]?.text || "");
                  }
                  setShowSeasons(false);
                }}
                className={`${
                  seasonBackupValue?.toLowerCase() === s.translations[0].text?.toLowerCase()
                    ? "bg-primary text-text-light"
                    : ""
                }`}
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
              </AsideScrollableButton>
            ))
          ) : (
            <AsideScrollableButton
              type="button"
              onClick={() => {
                setShowSeasons(false);
              }}
            >
              Нету Подходящих Сезонов
            </AsideScrollableButton>
          )}
        </AsideScrollable>
      ) : (
        <AsideScrollable ref={modalSeasonsRef} className={`${showSeasons ? "" : "hidden"} translate-y-[.5rem]`}>
          <AsideScrollableButton
            type="button"
            onClick={() => {
              setShowSeasons(false);
            }}
          >
            Выберите Историю
          </AsideScrollableButton>
        </AsideScrollable>
      )}
    </form>
  );
}
