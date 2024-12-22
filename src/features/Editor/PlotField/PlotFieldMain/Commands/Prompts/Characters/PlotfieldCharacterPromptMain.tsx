import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import useGetAllCharactersByStoryId from "../../../../../../../hooks/Fetching/Character/useGetAllCharactersByStoryId";
import useGetTranslationCharacters from "../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import usePlotfieldCommands from "../../../../Context/PlotFieldContext";
import {
  CharacterValueTypes,
  EmotionTypes,
} from "../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import PlotfieldCharactersPrompt from "./PlotfieldCharactersPrompt";
import useDebounce from "../../../../../../../hooks/utilities/useDebounce";

export type ExposedMethods = {
  updateCharacterNameOnBlur: () => void;
};

type PlotfieldCharacterPromptMainTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterModal: boolean;
  translateAsideValue: string;
  characterName: string;
  plotfieldCommandId?: string;
  currentCharacterId: string;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  setEmotionValue?: React.Dispatch<React.SetStateAction<EmotionTypes>>;
};

const PlotfieldCharacterPromptMain = forwardRef<ExposedMethods, PlotfieldCharacterPromptMainTypes>(
  (
    {
      setCharacterValue,
      setEmotionValue,
      currentCharacterId,
      setShowCharacterModal,
      characterName,
      showCharacterModal,
      translateAsideValue,
      plotfieldCommandId,
    },
    ref
  ) => {
    const { storyId } = useParams();
    const modalRef = useRef<HTMLDivElement>(null);
    const theme = localStorage.getItem("theme");
    const { updateCharacterProperties, updateEmotionProperties } = usePlotfieldCommands();

    const debouncedValue = useDebounce({ value: characterName || "", delay: 600 });

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
        if (debouncedValue?.trim().length) {
          return combinedCharacters.filter((cc) =>
            cc?.characterName?.toLowerCase().includes(debouncedValue?.toLowerCase())
          );
        } else {
          return combinedCharacters;
        }
      } else {
        return [];
      }
    }, [combinedCharacters, debouncedValue]);

    useImperativeHandle(ref, () => ({
      updateCharacterNameOnBlur,
    }));

    const updateCharacterNameOnBlur = () => {
      if (!debouncedValue?.trim().length) {
        return;
      }
      const tranlsatedCharacter = allTranslatedCharacters?.find((tc) =>
        tc.translations?.find(
          (tct) => tct.textFieldName === "characterName" && tct.text?.toLowerCase() === debouncedValue?.toLowerCase()
        )
      );
      if (!tranlsatedCharacter) {
        console.log("Non-existing character");
        return;
      }

      const character = allCharacters?.find((c) => c._id === tranlsatedCharacter?.characterId);

      if (currentCharacterId?.trim().length && currentCharacterId !== character?._id) {
        if (setEmotionValue) {
          setEmotionValue({
            _id: null,
            emotionName: null,
            imgUrl: null,
          });
          updateEmotionProperties({
            emotionId: "",
            emotionName: "",
            id: plotfieldCommandId || "",
            emotionImg: "",
          });
        }

        setCharacterValue({
          _id: character?._id || null,
          characterName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || null,
          imgUrl: character?.img || null,
        });

        updateCharacterProperties({
          characterId: character?._id || "",
          characterName:
            tranlsatedCharacter?.translations?.find((t) => t.textFieldName === "characterName")?.text || "",
          id: plotfieldCommandId || "",
          characterImg: character?.img || "",
        });
      }
    };

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
            <PlotfieldCharactersPrompt
              key={`${c.characterId}-${i}`}
              setShowCharacterModal={setShowCharacterModal}
              plotfieldCommandId={plotfieldCommandId}
              setCharacterValue={setCharacterValue}
              setEmotionValue={setEmotionValue}
              currentCharacterId={currentCharacterId}
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
);

PlotfieldCharacterPromptMain.displayName = "PlotfieldCharacterPromptMain";

export default PlotfieldCharacterPromptMain;
