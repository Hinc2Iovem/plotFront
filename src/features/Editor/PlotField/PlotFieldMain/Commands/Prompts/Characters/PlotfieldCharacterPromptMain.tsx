import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryId from "../../../../../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import PlotfieldCharactersPrompt from "./PlotfieldCharactersPrompt";
import { DebouncedCheckCharacterTypes } from "../../Choice/ChoiceQuestionField";
import usePlotfieldCommands from "../../../../Context/PlotFieldContext";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";

type PlotfieldCharacterPromptMainTypes = {
  setCharacterName?: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId?: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterImg?: React.Dispatch<React.SetStateAction<string>>;
  setNewlyCreated?: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterModal: boolean;
  characterValue: string;
  translateAsideValue: string;
  debouncedValue?: string;
  plotfieldCommandId?: string;
  currentCharacterId?: string;
  setCharacterValue?: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue?: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  setDebouncedCharacter?: React.Dispatch<React.SetStateAction<DebouncedCheckCharacterTypes | null>>;

  commandIfId: string;
  isElse: boolean;
};

export default function PlotfieldCharacterPromptMain({
  setCharacterValue,
  setEmotionValue,
  currentCharacterId,
  setCharacterName,
  setCharacterId,
  setCharacterImg,
  setShowCharacterModal,
  setNewlyCreated,
  setDebouncedCharacter,
  debouncedValue,
  showCharacterModal,
  characterValue,
  translateAsideValue,
  plotfieldCommandId,

  commandIfId,
  isElse,
}: PlotfieldCharacterPromptMainTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
  const {
    updateCharacterProperties,
    updateEmotionProperties,

    updateCharacterPropertiesIf,
    updateEmotionPropertiesIf,
  } = usePlotfieldCommands();

  const { data: allTranslatedCharacters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  const { data: allCharacters } = useGetAllCharactersByStoryId({
    storyId: storyId || "",
  });

  const combinedCharacters = useMemo(() => {
    if (allTranslatedCharacters && allCharacters) {
      return allCharacters.map((c) => {
        const currentTranslatedCharacter = allTranslatedCharacters.find((tc) => tc.characterId === c._id);
        return {
          characterImg: c?.img || "",
          characterId: c._id,
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
      if (characterValue?.trim().length) {
        return combinedCharacters.filter((cc) =>
          cc?.characterName?.toLowerCase().includes(characterValue?.toLowerCase())
        );
      } else {
        return combinedCharacters;
      }
    } else {
      return [];
    }
  }, [combinedCharacters, characterValue]);

  useEffect(() => {
    if (debouncedValue && !showCharacterModal) {
      const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
        tc.translations?.find(
          (tct) => tct.textFieldName === "characterName" && tct.text?.toLowerCase() === characterValue?.toLowerCase()
        )
      );
      if (!tranlsatedCharacter) {
        console.log("Non-existing character");
        return;
      }

      const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

      if (setEmotionValue && currentCharacterId?.trim().length && currentCharacterId !== character?._id) {
        setEmotionValue({
          _id: null,
          emotionName: null,
          imgUrl: null,
        });

        if (commandIfId?.trim().length) {
          updateEmotionPropertiesIf({
            emotionId: "",
            emotionName: "",
            id: plotfieldCommandId || "",
            emotionImg: "",
            isElse,
          });
        } else {
          updateEmotionProperties({
            emotionId: "",
            emotionName: "",
            id: plotfieldCommandId || "",
            emotionImg: "",
          });
        }
      }

      if (setCharacterValue) {
        setCharacterValue({
          _id: character?._id || null,
          characterName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || null,
          imgUrl: character?.img || null,
        });
      }

      if (setCharacterId) {
        setCharacterId(character?._id || "");
      }
      if (setCharacterName) {
        setCharacterName(
          tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || ""
        );
      }
      if (setCharacterImg) {
        setCharacterImg(character?.img || "");
      }

      if (commandIfId?.trim().length) {
        updateCharacterPropertiesIf({
          characterId: character?._id || "",
          characterName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
          id: plotfieldCommandId || "",
          characterImg: character?.img || "",
          isElse,
        });
      } else {
        updateCharacterProperties({
          characterId: character?._id || "",
          characterName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
          id: plotfieldCommandId || "",
          characterImg: character?.img || "",
        });
      }
      if (setDebouncedCharacter) {
        setDebouncedCharacter({
          characterId: character?._id || "",
          characterName:
            tranlsatedCharacter?.translations?.find((tct) => tct.textFieldName === "characterName")?.text || "",
          characterImg: character?.img || "",
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
        !allCharacters?.length && characterValue ? "hidden" : ""
      } ${translateAsideValue}`}
    >
      {filteredCharacters?.length ? (
        filteredCharacters?.map((c, i) => (
          <PlotfieldCharactersPrompt
            key={`${c.characterId}-${i}`}
            setCharacterName={setCharacterName}
            setCharacterId={setCharacterId}
            setCharacterImg={setCharacterImg}
            setShowCharacterModal={setShowCharacterModal}
            setNewlyCreated={setNewlyCreated}
            plotfieldCommandId={plotfieldCommandId}
            setCharacterValue={setCharacterValue}
            setEmotionValue={setEmotionValue}
            currentCharacterId={currentCharacterId}
            commandIfId={commandIfId}
            isElse={isElse}
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
