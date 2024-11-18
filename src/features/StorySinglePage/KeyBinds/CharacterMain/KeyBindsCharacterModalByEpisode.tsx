import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryId from "../../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useDebounce from "../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../shared/Inputs/PlotfieldInput";
import AsideScrollable from "../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useOutOfModal from "../../../../hooks/UI/useOutOfModal";

type KeyBindsCharacterModalTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  characterName: string;
  characterId: string;
  index: number;
  episodeId: string;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
};

export default function KeyBindsCharacterModalByEpisode({
  characterId,
  characterName,
  index,
  setCharacterId,
  setCharacterName,
  setShowModal,
  showModal,
  episodeId,
}: KeyBindsCharacterModalTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);

  const [characterBackupValue, setCharacterBackupValue] = useState("");
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const { data: characters } = useGetAllCharactersByStoryId({
    storyId: storyId || "",
  });
  const { data: translatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const debouncedValue = useDebounce({ value: characterName, delay: 700 });

  useEffect(() => {
    const savedByStoryValue = localStorage.getItem(`story-${storyId}-c-${index}`);
    const savedByEpisode = localStorage.getItem(`episode-${episodeId}-c-${index}`);
    if (savedByEpisode) {
      setCharacterId(savedByEpisode.split("-")[0]);
      setCharacterName(savedByEpisode.split("-")[1]);
    } else if (savedByStoryValue) {
      setCharacterId(savedByStoryValue.split("-")[0]);
      setCharacterName(savedByStoryValue.split("-")[1]);
    } else {
      setCharacterId("");
      setCharacterName("");
    }
  }, [index, storyId, episodeId]);

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
    if (!characterId && debouncedValue?.trim().length) {
      const characterId =
        translatedCharacters?.find((cs) => (cs?.translations || [])[0]?.text === debouncedValue)?.characterId || "";
      setCharacterId(characterId);
      localStorage.setItem(`episode-${episodeId}-c-${index}`, `${characterId}-${characterName}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, translatedCharacters]);

  useEffect(() => {
    if (!showModal && !characterName && characterBackupValue) {
      setCharacterName(characterBackupValue);
    }
  }, [showModal, characterName, characterBackupValue]);

  useEffect(() => {
    if (debouncedValue?.trim().length) {
      const matchedCharacter = translatedCharacters?.find((cs) =>
        cs?.translations?.some(
          (tct) => tct.textFieldName === "characterName" && tct.text.toLowerCase() === debouncedValue.toLowerCase()
        )
      );

      if (matchedCharacter) {
        localStorage.setItem(`episode-${episodeId}-c-${index}`, `${characterId}-${characterName}`);
        setCharacterId(matchedCharacter.characterId);
      } else {
        localStorage.removeItem(`episode-${episodeId}-c-${index}`);
        setCharacterId("");
        setCharacterBackupValue("");
      }
    }
  }, [debouncedValue, translatedCharacters]);

  useOutOfModal({
    modalRef,
    setShowModal,
    showModal,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowModal(false);
      }}
      className="relative w-[20rem]"
    >
      <PlotfieldInput
        focusedSecondTime={focusedSecondTime}
        onBlur={() => {
          setFocusedSecondTime(false);
        }}
        setFocusedSecondTime={setFocusedSecondTime}
        onChange={(e) => {
          setShowModal(true);
          setCharacterName(e.target.value);
        }}
        value={characterName}
        onClick={(e) => {
          e.stopPropagation();
          setShowModal((prev) => !prev);
          if (characterName?.trim().length) {
            setCharacterBackupValue(characterName);
          }
          setCharacterName("");
        }}
      />
      <AsideScrollable ref={modalRef} className={`${showModal ? "" : "hidden"} translate-y-[.5rem]`}>
        {filteredMemoization.length ? (
          filteredMemoization?.map((mc) => (
            <AsideScrollableButton
              className="flex items-center justify-between"
              key={mc?.characterId}
              type="button"
              onClick={() => {
                setShowModal(false);
                setCharacterId(mc.characterId);
                setCharacterName(mc.characterName);
                localStorage.setItem(`episode-${episodeId}-c-${index}`, `${mc.characterId}-${mc.characterName}`);
              }}
            >
              {mc.characterName}
              {mc?.characterImg ? (
                <img
                  className="w-[3rem] rounded-md shadow-sm shadow-light-gray"
                  src={mc.characterImg}
                  alt={mc.characterName}
                />
              ) : null}
            </AsideScrollableButton>
          ))
        ) : (
          <AsideScrollableButton onClick={() => setShowModal(false)}>Пусто</AsideScrollableButton>
        )}
      </AsideScrollable>
    </form>
  );
}
