import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useRef, useState } from "react";
import useGetSeasonsByStoryId from "../../../../../hooks/Fetching/Season/useGetSeasonsByStoryId";
import useOutOfModal from "../../../../../hooks/UI/useOutOfModal";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import CheckForCompletenessEpisode from "./CheckForCompletenessEpisode";

type SeasonPromptTypes = {
  setSeasonId: React.Dispatch<React.SetStateAction<string>>;
  storyId: string;
  currentLanguage?: CurrentlyAvailableLanguagesTypes;
  translateToLanguage?: CurrentlyAvailableLanguagesTypes;
  setSeasonValue?: React.Dispatch<React.SetStateAction<string>>;
  seasonValue?: string;
  seasonId: string;
  currentTranslationView?: "episode";
};

export default function SeasonPrompt({
  setSeasonId,
  storyId,
  currentLanguage,
  translateToLanguage,
  seasonValue,
  seasonId,
  currentTranslationView,
  setSeasonValue,
}: SeasonPromptTypes) {
  const [showSeasons, setShowSeasons] = useState(false);
  const [seasonBackupValue, setSeasonBackupValue] = useState("");
  const modalSeasonsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: seasonsSearch, isLoading } = useGetSeasonsByStoryId({
    language: "russian",
    storyId,
  });

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

  const onBlur = () => {
    if (!seasonValue?.trim().length) {
      if (setSeasonValue) setSeasonValue(seasonBackupValue);
      return;
    }

    const matchedValue = seasonsSearch?.find((cs) =>
      cs?.translations?.some(
        (tct) => tct.textFieldName === "seasonName" && tct.text.toLowerCase() === seasonValue?.toLowerCase()
      )
    );
    if (matchedValue) {
      setSeasonId(matchedValue?.seasonId);
      if (setSeasonValue) {
        setSeasonValue(matchedValue?.translations[0]?.text);
      }
      setSeasonBackupValue(matchedValue?.translations[0]?.text);
    } else {
      if (setSeasonValue) setSeasonValue(seasonBackupValue);
      setSeasonId("");
    }
  };

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
    <Popover open={showSeasons} onOpenChange={setShowSeasons}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className="px-[10px] py-[20px] text-[15px] capitalize text-text">
          {seasonId?.trim().length ? seasonBackupValue : "Название Сезона"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="translate-x-[20px]">
        <Command className="w-full" onSubmit={handleSubmit}>
          <CommandInput
            className="flex-grow text-text"
            ref={inputRef}
            placeholder="Название Сезона"
            onClick={(e) => {
              e.stopPropagation();
              if (setSeasonValue) {
                setSeasonValue("");
              }
              setShowSeasons(true);
            }}
            value={seasonValue}
            onBlur={onBlur}
            onValueChange={(e) => {
              if (setSeasonValue) {
                setSeasonValue(e);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>Сезон не найден</CommandEmpty>
            <CommandGroup className="flex flex-col gap-[10px]">
              {isLoading ? (
                <CommandItem className="text-[14px] text-text text-center py-[5px]">Загрузка...</CommandItem>
              ) : filteredSeasons && filteredSeasons.length > 0 ? (
                filteredSeasons.map((s) => (
                  <CommandItem
                    key={s._id}
                    onSelect={() => {
                      setSeasonId(s.seasonId);
                      setSeasonBackupValue(s.translations[0]?.text || "");
                      if (setSeasonValue) {
                        setSeasonValue(s.translations[0]?.text || "");
                      }
                      setShowSeasons(false);
                    }}
                    className={`${
                      seasonBackupValue?.toLowerCase() === s.translations[0].text?.toLowerCase()
                        ? "underline bg-accent"
                        : "transition-all"
                    } text-[17px] text-text relative capitalize`}
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
                  </CommandItem>
                ))
              ) : (
                <Button
                  type="button"
                  variant="link"
                  className="text-text text-[15px]"
                  onClick={() => {
                    setShowSeasons(false);
                  }}
                >
                  Нету Подходящих Сезонов
                </Button>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
