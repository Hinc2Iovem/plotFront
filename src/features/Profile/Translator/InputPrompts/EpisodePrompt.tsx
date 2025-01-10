import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import useGetEpisodesTranslationsBySeasonId from "../../../../hooks/Fetching/Translation/Episode/useGetEpisodesTranslationsBySeasonId";

type EpisodePromptTypes = {
  setEpisodeId: React.Dispatch<React.SetStateAction<string>>;
  setEpisodeCurrentValue?: React.Dispatch<React.SetStateAction<string>>;
  seasonId: string;
  episodeId: string;
  episodeCurrentValue?: string;
};

export default function EpisodePrompt({
  setEpisodeCurrentValue,
  setEpisodeId,
  seasonId,
  episodeId,
  episodeCurrentValue,
}: EpisodePromptTypes) {
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodeValue, setEpisodeValue] = useState("");
  const [episodeBackupValue, setEpisodeBackupValue] = useState("");

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

  const onBlur = () => {
    if (!episodeValue) {
      setEpisodeValue(episodeBackupValue);
      return;
    }

    const matchedValue = episodesSearch?.find((cs) =>
      cs?.translations?.some(
        (tct) => tct.textFieldName === "episodeName" && tct.text.toLowerCase() === episodeValue.toLowerCase()
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
      setEpisodeValue(episodeBackupValue);
    }
  };

  return (
    <Popover open={showEpisodes} onOpenChange={setShowEpisodes}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="px-[10px] py-[20px] text-[15px] capitalize text-text">
          {episodeId?.trim().length ? episodeBackupValue : "Название Эпизода"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="translate-x-[20px]">
        <Command className="w-full">
          <CommandInput
            className="flex-grow text-text"
            placeholder="Название Эпизода"
            onClick={(e) => {
              e.stopPropagation();
              if (setEpisodeValue) {
                setEpisodeValue("");
              }
              setShowEpisodes(true);
            }}
            value={episodeValue}
            onBlur={onBlur}
            onValueChange={(e) => {
              if (setEpisodeValue) {
                setEpisodeValue(e);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>Выберите Сезон</CommandEmpty>

            <CommandGroup className={`${seasonId?.trim().length ? "flex" : "hidden"} flex-col gap-[10px] items-center`}>
              {isLoading ? (
                <CommandItem className="text-[14px] text-text text-center py-[5px]">Загрузка...</CommandItem>
              ) : filteredEpisodes && filteredEpisodes.length > 0 ? (
                filteredEpisodes.map((s) => (
                  <CommandItem
                    key={s._id}
                    onSelect={() => {
                      setEpisodeId(s.episodeId);
                      setEpisodeBackupValue(s.translations[0]?.text || "");
                      if (setEpisodeValue) {
                        setEpisodeValue(s.translations[0]?.text || "");
                      }
                      setShowEpisodes(false);
                    }}
                    className={`${
                      episodeBackupValue?.toLowerCase() === s.translations[0].text?.toLowerCase()
                        ? "underline bg-accent"
                        : "transition-all"
                    } text-[17px] text-text relative capitalize`}
                  >
                    {s.translations[0]?.text || ""}
                  </CommandItem>
                ))
              ) : (
                <Button
                  type="button"
                  variant="link"
                  className="text-text text-[15px]"
                  onClick={() => {
                    setShowEpisodes(false);
                  }}
                >
                  Нету Подходящих Эпизодов
                </Button>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
