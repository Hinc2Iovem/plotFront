import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../hooks/utilities/useDebounce";
import useGetEpisodeTranslationByTextFieldNameAndSearch from "../../../../hooks/Fetching/Episode/useGetEpisodeTranslationByTextFieldNameAndSearch";

type EpisodePromptTypes = {
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
  seasonId: string;
};

export default function EpisodePrompt({
  setEpisodeId,
  seasonId,
}: EpisodePromptTypes) {
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodeValue, setEpisodeValue] = useState("");
  const [episodeBackupValue, setEpisodeBackupValue] = useState("");

  const modalEpisodesRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef: modalEpisodesRef,
    setShowModal: setShowEpisodes,
    showModal: showEpisodes,
  });

  const debouncedValue = useDebounce({ value: episodeValue, delay: 500 });

  const { data: episodesSearch, isLoading } =
    useGetEpisodeTranslationByTextFieldNameAndSearch({
      debouncedValue,
      language: "russian",
      seasonId,
    });

  useEffect(() => {
    if (debouncedValue?.trim().length) {
      setEpisodeId(
        episodesSearch?.find(
          (cs) => cs.translations[0]?.text === debouncedValue
        )?.episodeId || ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, episodesSearch]);

  useEffect(() => {
    if (!showEpisodes && !episodeValue && episodeBackupValue) {
      setEpisodeValue(episodeBackupValue);
    }
  }, [showEpisodes, episodeValue, episodeBackupValue]);

  return (
    <form
      className="bg-secondary rounded-md shadow-md relative"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        className="w-full rounded-md shadow-md bg-secondary text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
        placeholder="Название Эпизода"
        onClick={(e) => {
          e.stopPropagation();
          if (episodeValue?.trim().length) {
            setEpisodeBackupValue(episodeValue);
          }
          setEpisodeValue("");
          setShowEpisodes(true);
        }}
        value={episodeValue}
        onChange={(e) => setEpisodeValue(e.target.value)}
      />
      {seasonId ? (
        <aside
          ref={modalEpisodesRef}
          className={`${
            showEpisodes ? "" : "hidden"
          } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
        >
          {isLoading ? (
            <div className="text-[1.4rem] text-gray-600 text-center py-[.5rem]">
              Загрузка...
            </div>
          ) : episodesSearch && episodesSearch.length > 0 ? (
            episodesSearch.map((s) => (
              <button
                key={s._id}
                type="button"
                onClick={() => {
                  setEpisodeId(s.episodeId);
                  setEpisodeValue(s.translations[0]?.text || "");
                  setShowEpisodes(false);
                }}
                className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
              >
                {s.translations[0]?.text || ""}
              </button>
            ))
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowEpisodes(false);
              }}
              className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
            >
              Нету Подходящих Эпизодов
            </button>
          )}
        </aside>
      ) : (
        <aside
          ref={modalEpisodesRef}
          className={`${
            showEpisodes ? "" : "hidden"
          } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
        >
          <button
            type="button"
            onClick={() => {
              setShowEpisodes(false);
            }}
            className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
          >
            Выберите Сезон
          </button>
        </aside>
      )}
    </form>
  );
}
