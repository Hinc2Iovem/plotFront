import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryIdAndType from "../../../../../../../hooks/Fetching/Character/useGetAllCharactersByStoryIdAndType";
import useGetTranslationCharactersByStoryIdAndType from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharactersByStoryIdAndType";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import PlotfieldUnknownCharactersPrompt from "./PlotfieldUnknownCharactersPrompt";

export type UnknownCharacterValueTypes = {
  characterUnknownName: string;
  characterImg?: string;
  characterId: string;
  characterName: string;
};

type PlotfieldUnknownCharacterPromptMainTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterModal: boolean;
  translateAsideValue: string;
  debouncedValue?: string;
  setCharacterValue?: React.Dispatch<React.SetStateAction<UnknownCharacterValueTypes>>;
};

export default function PlotfieldUnknownCharacterPromptMain({
  setCharacterValue,
  setShowCharacterModal,
  debouncedValue,
  showCharacterModal,
  translateAsideValue,
}: PlotfieldUnknownCharacterPromptMainTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");

  const { data: allTranslatedCharacters } = useGetTranslationCharactersByStoryIdAndType({
    storyId: storyId || "",
    language: "russian",
    type: "minorcharacter",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryIdAndType({
    storyId: storyId || "",
    searchCharacterType: "minorcharacter",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
          characterUnknownName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterUnknownName")?.text ||
            "",
          characterName:
            currentTranslatedCharacter?.translations?.find((tc) => tc.textFieldName === "characterName")?.text || "",
        };
      });
    } else {
      return [];
    }
  }, [allTranslatedCharacters, allCharacters]);

  const filteredCharacters = useMemo(() => {
    if (combinedCharacters) {
      if (debouncedValue?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterUnknownName?.toLowerCase().includes(debouncedValue?.toLowerCase())
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, debouncedValue]);

  useEffect(() => {
    if (debouncedValue && !showCharacterModal) {
      const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
        tc.translations?.find(
          (tct) =>
            tct.textFieldName === "characterUnknownName" && tct.text?.toLowerCase() === debouncedValue?.toLowerCase()
        )
      );
      if (!tranlsatedCharacter) {
        console.log("Non-existing character");
        return;
      }

      const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

      if (setCharacterValue) {
        setCharacterValue({
          characterId: character?._id || "",
          characterUnknownName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterUnknownName")?.text || "",
          characterImg: character?.img || "",
          characterName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
        });
      }
    }
  }, [debouncedValue, showCharacterModal]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterModal,
    showModal: showCharacterModal,
  });

  return (
    <AsideScrollable
      ref={modalRef}
      className={`${showCharacterModal ? "" : "hidden"} ${
        !allCharacters?.length && debouncedValue ? "hidden" : ""
      } ${translateAsideValue}`}
    >
      {filteredCharacters?.length ? (
        filteredCharacters?.map((c, i) => (
          <PlotfieldUnknownCharactersPrompt
            key={`${c.characterId}-${i}`}
            setShowCharacterModal={setShowCharacterModal}
            setCharacterValue={setCharacterValue}
            {...c}
          />
        ))
      ) : !filteredCharacters?.length ? (
        <button
          type="button"
          className={`text-start ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:bg-primary-darker focus-within:text-text-light text-[1.3rem] px-[1rem] py-[.5rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all rounded-md`}
        >
          Пусто
        </button>
      ) : null}
    </AsideScrollable>
  );
}
