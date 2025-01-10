import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryId from "../../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../hooks/UI/useOutOfModal";

type KeyBindsCharacterModalTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  characterName: string;
  characterId: string;
  episodeId?: string;
  index: number;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  type: "episode" | "story";
};

export default function KeyBindsCharacterModal({
  characterId,
  characterName,
  index,
  setCharacterId,
  setCharacterName,
  setShowModal,
  showModal,
  type,
  episodeId,
}: KeyBindsCharacterModalTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);

  const [characterBackupValue, setCharacterBackupValue] = useState("");

  const { data: characters } = useGetAllCharactersByStoryId({
    storyId: storyId || "",
  });
  const { data: translatedCharacters, isLoading } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  useEffect(() => {
    const savedValue =
      type === "story"
        ? localStorage.getItem(`story-${storyId}-c-${index}`)
        : localStorage.getItem(`episode-${episodeId}-c-${index}`);
    if (savedValue) {
      setCharacterId(savedValue.split("-")[0]);
      setCharacterName(savedValue.split("-")[1]);
    }
  }, [index, storyId]);

  const memoizedCharacters = useMemo(() => {
    if (characters && translatedCharacters) {
      return characters?.map((c) => {
        const currentTranslatedCharacter = translatedCharacters.find((tc) => tc.characterId === c._id);
        const characterName =
          currentTranslatedCharacter?.translations?.find((tct) => tct.textFieldName === "characterName")?.text || "";

        return {
          characterId: c._id,
          characterName,
          characterImg: c?.img || "",
        };
      });
    } else {
      return [];
    }
  }, [characters, translatedCharacters]);

  const filteredMemoization = useMemo(() => {
    if (characterName?.trim().length) {
      return memoizedCharacters.filter((mc) => mc.characterName.toLowerCase().includes(characterName.toLowerCase()));
    }
    return memoizedCharacters;
  }, [memoizedCharacters, characterName]);

  useEffect(() => {
    if (!showModal && !characterName && characterBackupValue) {
      setCharacterName(characterBackupValue);
    }
  }, [showModal, characterName, characterBackupValue]);

  const onBlur = () => {
    if (!characterName) {
      setCharacterId("");
      setCharacterBackupValue("");
      return;
    }

    const matchedCharacter = translatedCharacters?.find((cs) =>
      cs?.translations?.some(
        (tct) => tct.textFieldName === "characterName" && tct.text.toLowerCase() === characterName.toLowerCase()
      )
    );

    if (matchedCharacter) {
      if (type === "story") {
        localStorage.setItem(`story-${storyId}-c-${index}`, `${characterId}-${characterName}`);
      } else {
        localStorage.setItem(`episode-${episodeId}-c-${index}`, `${characterId}-${characterName}`);
      }

      setCharacterId(matchedCharacter.characterId);
    } else {
      if (type === "story") {
        localStorage.removeItem(`story-${storyId}-c-${index}`);
      } else {
        localStorage.removeItem(`episode-${episodeId}-c-${index}`);
      }
      setCharacterId("");
      setCharacterBackupValue("");
    }
  };

  useOutOfModal({
    modalRef,
    setShowModal,
    showModal,
  });

  return (
    <Popover open={showModal} onOpenChange={setShowModal}>
      <PopoverTrigger className="w-full text-start" asChild>
        <Button
          variant={"outline"}
          className={`px-[10px] py-[20px] text-[15px] capitalize ${
            characterId?.trim().length ? "" : "opacity-70"
          } text-text text-start`}
        >
          {characterId?.trim().length ? characterName : "Имя Персонажа"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="translate-x-[20px] w-full">
        <Command className="w-full">
          <CommandInput
            className="flex-grow text-text"
            placeholder="Название Эпизода"
            onClick={(e) => {
              e.stopPropagation();
              setCharacterName("");
              setShowModal(true);
            }}
            value={characterName}
            onBlur={onBlur}
            onValueChange={(e) => {
              if (setCharacterName) {
                setCharacterName(e);
              }
            }}
          />
          <CommandList>
            <CommandEmpty>Пусто</CommandEmpty>

            <CommandGroup className={`flex flex-col gap-[10px]`}>
              {isLoading ? (
                <CommandItem className="text-[14px] text-text text-center py-[5px]">Загрузка...</CommandItem>
              ) : filteredMemoization && filteredMemoization.length > 0 ? (
                filteredMemoization.map((s) => (
                  <CommandItem
                    key={s.characterId}
                    onSelect={() => {
                      setCharacterId(s.characterId);
                      setCharacterBackupValue(s.characterName || "");
                      setCharacterName(s.characterName || "");
                      if (type === "story") {
                        localStorage.setItem(`story-${storyId}-c-${index}`, `${s.characterId}-${s.characterName}`);
                      } else {
                        localStorage.setItem(`episode-${episodeId}-c-${index}`, `${s.characterId}-${s.characterName}`);
                      }
                      setShowModal(false);
                    }}
                    className={`${
                      characterBackupValue?.toLowerCase() === s.characterName.toLowerCase()
                        ? "underline bg-accent"
                        : "transition-all"
                    } text-[17px] text-text relative capitalize`}
                  >
                    {s.characterName}
                    {s?.characterImg ? (
                      <img
                        className="w-[3rem] rounded-md shadow-sm shadow-light-gray"
                        src={s.characterImg}
                        alt={s.characterName}
                      />
                    ) : null}
                  </CommandItem>
                ))
              ) : (
                <Button
                  type="button"
                  variant="link"
                  className="text-text text-[15px]"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Персонажи не найдены
                </Button>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
