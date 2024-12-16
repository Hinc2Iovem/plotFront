import { useEffect, useMemo, useRef, useState } from "react";
import useGetEpisodesTranslationsBySeasonId from "../../../../hooks/Fetching/Translation/Episode/useGetEpisodesTranslationsBySeasonId";
import useOutOfModal from "../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../hooks/utilities/useDebounce";
import AsideScrollable from "../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../ui/Inputs/PlotfieldInput";

type EpisodePromptTypes = {
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
  setEpisodeCurrentValue?: React.Dispatch<React.SetStateAction<string>>;
  seasonId: string;
  episodeCurrentValue?: string;
};

export default function EpisodePrompt({
  setEpisodeCurrentValue,
  setEpisodeId,
  seasonId,
  episodeCurrentValue,
}: EpisodePromptTypes) {
  const [showEpisodes, setShowEpisodes] = useState(false);
  // const [episodeValue, setEpisodeValue] = useState("");
  const [episodeBackupValue, setEpisodeBackupValue] = useState("");

  const modalEpisodesRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef: modalEpisodesRef,
    setShowModal: setShowEpisodes,
    showModal: showEpisodes,
  });

  const debouncedValue = useDebounce({
    value: episodeCurrentValue || "",
    delay: 500,
  });

  const { data: episodesSearch, isLoading } = useGetEpisodesTranslationsBySeasonId({
    language: "russian",
    seasonId,
  });

  const filteredEpisodes = useMemo(() => {
    if (episodesSearch) {
      return episodesSearch.filter((episode) =>
        episode.translations.some(
          (translation) =>
            translation.textFieldName === "episodeName" &&
            translation.text.toLowerCase().includes((episodeCurrentValue || "").toLowerCase())
        )
      );
    }
    return [];
  }, [episodesSearch, episodeCurrentValue]);

  useEffect(() => {
    if (!showEpisodes && !episodeCurrentValue && episodeBackupValue && setEpisodeCurrentValue) {
      setEpisodeCurrentValue(episodeBackupValue);
    }
  }, [showEpisodes, episodeCurrentValue, episodeBackupValue]);

  useEffect(() => {
    if (debouncedValue) {
      const matchedValue = episodesSearch?.find((cs) =>
        cs?.translations?.some(
          (tct) => tct.textFieldName === "episodeName" && tct.text.toLowerCase() === debouncedValue.toLowerCase()
        )
      );
      if (matchedValue) {
        setEpisodeId(matchedValue?.episodeId);
        setEpisodeBackupValue(matchedValue?.translations[0]?.text);
        if (setEpisodeCurrentValue) {
          setEpisodeCurrentValue(matchedValue?.translations[0]?.text);
        }
      } else {
        setEpisodeId("");
      }
    }
  }, [debouncedValue, episodesSearch]);

  return (
    <form className="rounded-md shadow-md relative" onSubmit={(e) => e.preventDefault()}>
      <PlotfieldInput
        type="text"
        placeholder="Название Эпизода"
        onClick={(e) => {
          e.stopPropagation();
          if (episodeCurrentValue?.trim().length) {
            setEpisodeBackupValue(episodeCurrentValue);
          }
          if (setEpisodeCurrentValue) {
            setEpisodeCurrentValue("");
          }
          setShowEpisodes(true);
        }}
        value={episodeCurrentValue}
        onChange={(e) => {
          if (setEpisodeCurrentValue) {
            setEpisodeCurrentValue(e.target.value);
          }
        }}
      />
      {seasonId ? (
        <AsideScrollable ref={modalEpisodesRef} className={`${showEpisodes ? "" : "hidden"} translate-y-[.5rem]`}>
          {isLoading ? (
            <div className="text-[1.4rem] text-gray-600 text-center py-[.5rem]">Загрузка...</div>
          ) : filteredEpisodes && filteredEpisodes.length > 0 ? (
            filteredEpisodes.map((s) => (
              <AsideScrollableButton
                key={s._id}
                type="button"
                onClick={() => {
                  setEpisodeId(s.episodeId);
                  if (setEpisodeCurrentValue) {
                    setEpisodeCurrentValue(s.translations[0]?.text || "");
                  }
                  setShowEpisodes(false);
                }}
              >
                {s.translations[0]?.text || ""}
              </AsideScrollableButton>
            ))
          ) : (
            <AsideScrollableButton
              type="button"
              onClick={() => {
                setShowEpisodes(false);
              }}
            >
              Нету Подходящих Эпизодов
            </AsideScrollableButton>
          )}
        </AsideScrollable>
      ) : (
        <AsideScrollable ref={modalEpisodesRef} className={`${showEpisodes ? "" : "hidden"} translate-y-[.5rem]`}>
          <AsideScrollableButton
            type="button"
            onClick={() => {
              setShowEpisodes(false);
            }}
          >
            Выберите Сезон
          </AsideScrollableButton>
        </AsideScrollable>
      )}
    </form>
  );
}
