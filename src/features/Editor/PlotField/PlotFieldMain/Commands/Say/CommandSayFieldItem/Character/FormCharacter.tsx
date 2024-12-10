import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacters from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useCheckIsCurrentFieldFocused from "../../../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/useUpdateNameOrEmotion";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes, EmotionTypes } from "./CommandSayCharacterFieldItem";
import CommandSayCreateCharacterFieldModal from "./ModalCreateCharacter/CommandSayCreateCharacterFieldModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { useQueryClient } from "@tanstack/react-query";

type FormCharacterTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  setShowCreateCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  showCharacters: boolean;
  showCreateCharacterModal: boolean;
  topologyBlockId: string;
  initialCharacterId: string;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;

  commandIfId: string;
  isElse: boolean;
};

export default function FormCharacter({
  plotFieldCommandId,
  plotFieldCommandSayId,
  setShowCreateCharacterModal,
  setShowCharacters,
  setShowAllEmotions,
  setEmotionValue,
  setCharacterValue,
  characterValue,
  showCharacters,
  showCreateCharacterModal,

  commandIfId,
  isElse,
}: FormCharacterTypes) {
  const charactersRef = useRef<HTMLDivElement>(null);
  const { storyId } = useParams();
  const [previousCharacterId, setPreviousCharacterId] = useState(characterValue?._id || "");
  const queryClient = useQueryClient();

  const {
    updateEmotionProperties,
    updateCharacterName,

    updateEmotionPropertiesIf,
    updateCharacterNameIf,
  } = usePlotfieldCommands();

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const debouncedValue = useDebounce({
    delay: 700,
    value: characterValue?.characterName || "",
  });

  const currentInput = useRef<HTMLInputElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const { data: translatedCharacters } = useGetTranslationCharacters({
    storyId: storyId ?? "",
    language: "russian",
  });

  const allNames = useMemo(() => {
    if (translatedCharacters) {
      const names = translatedCharacters.map((tc) => (tc.translations || [])[0].text.toLowerCase());
      return names;
    }
    return [];
  }, [translatedCharacters]);

  const handleNameFormSubmit = (e: React.FormEvent, nf?: string) => {
    e.preventDefault();
    if (!characterValue?.characterName?.trim().length && !nf?.trim().length) {
      console.log("Заполните поле");
      return;
    }
    if (
      allNames.includes((characterValue?.characterName || "")?.toLowerCase()) ||
      (nf && allNames.includes(nf.toLowerCase()))
    ) {
      translatedCharacters?.map((tc) => {
        if (
          tc.translations?.find(
            (tct) =>
              tct.text?.toLowerCase() === (characterValue?.characterName || "")?.toLowerCase() ||
              (nf && tct.text.toLowerCase() === nf.toLowerCase())
          )
        ) {
          setCharacterValue({
            _id: tc.characterId,
            characterName: (tc.translations || [])[0]?.text,
            imgUrl: null,
          });

          updateCharacterName({
            id: plotFieldCommandId,
            characterName: (tc.translations || [])[0]?.text,
          });

          setEmotionValue({
            _id: null,
            emotionName: null,
            imgUrl: null,
          });

          if (commandIfId?.trim().length) {
            updateEmotionPropertiesIf({
              id: plotFieldCommandId,
              emotionId: "",
              emotionName: "",
              emotionImg: "",
              isElse: isElse,
            });
          } else {
            updateEmotionProperties({
              id: plotFieldCommandId,
              emotionId: "",
              emotionName: "",
              emotionImg: "",
            });
          }

          updateNameOrEmotion.mutate({ characterBodyId: tc.characterId });
        }
      });
    } else {
      console.log("No such character, want to create a new one?");
      setShowCreateCharacterModal(true);
      return;
    }
  };

  useEffect(() => {
    if (characterValue?._id && characterValue._id !== previousCharacterId) {
      queryClient.invalidateQueries({
        queryKey: ["character", previousCharacterId],
      });

      setPreviousCharacterId(characterValue._id);
      updateNameOrEmotion.mutate({ characterBodyId: characterValue._id });
      setEmotionValue({
        _id: null,
        emotionName: null,
        imgUrl: null,
      });

      if (commandIfId?.trim().length) {
        updateEmotionPropertiesIf({
          id: plotFieldCommandId,
          emotionId: "",
          emotionName: "",
          emotionImg: "",
          isElse: isElse,
        });
      } else {
        updateEmotionProperties({
          id: plotFieldCommandId,
          emotionId: "",
          emotionName: "",
          emotionImg: "",
        });
      }
    }
  }, [characterValue._id]);

  useOutOfModal({
    modalRef: charactersRef,
    setShowModal: setShowCharacters,
    showModal: showCharacters,
  });

  return (
    <>
      <form onSubmit={handleNameFormSubmit} className={`${showCharacters ? "z-[10]" : ""} w-full relative`}>
        <PlotfieldInput
          ref={currentInput}
          onClick={(e) => {
            e.stopPropagation();
            setShowCharacters(true);
            setShowAllEmotions(false);
          }}
          className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}
          value={characterValue?.characterName || ""}
          onChange={(e) => {
            setShowCharacters(true);
            setShowAllEmotions(false);
            setCharacterValue((prev) => ({
              _id: prev?._id || "",
              characterName: e.target.value,
              imgUrl: prev?.imgUrl || "",
            }));
            if (commandIfId?.trim().length) {
              updateCharacterNameIf({
                id: plotFieldCommandId,
                characterName: e.target.value,
                isElse,
              });
            } else {
              updateCharacterName({
                id: plotFieldCommandId,
                characterName: e.target.value,
              });
            }
          }}
          placeholder="Имя Персонажа"
        />

        <img
          src={characterValue?.imgUrl || ""}
          alt="CharacterImg"
          className={`${
            characterValue.imgUrl?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover top-[1.5px] rounded-md right-0 absolute`}
        />
        <PlotfieldCharacterPromptMain
          translateAsideValue={"translate-y-[.5rem]"}
          characterValue={characterValue?.characterName || ""}
          setShowCharacterModal={setShowCharacters}
          showCharacterModal={showCharacters}
          plotfieldCommandId={plotFieldCommandId}
          setCharacterValue={setCharacterValue}
          setEmotionValue={setEmotionValue}
          currentCharacterId={characterValue?._id || ""}
          debouncedValue={debouncedValue}
          commandIfId={commandIfId}
          isElse={isElse}
        />
      </form>
      <CommandSayCreateCharacterFieldModal
        characterName={characterValue.characterName || ""}
        characterId={characterValue?._id || ""}
        commandSayId={plotFieldCommandSayId}
        plotFieldCommandId={plotFieldCommandId}
        setShowModal={setShowCreateCharacterModal}
        showModal={showCreateCharacterModal}
        setCharacterValue={setCharacterValue}
        commandIfId={commandIfId}
        isElse={isElse}
      />
    </>
  );
}
