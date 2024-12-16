import { useEffect, useRef } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import PlotfieldInput from "../../../../../../../../ui/Inputs/PlotfieldInput";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/useUpdateNameOrEmotion";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes, EmotionTypes } from "./CommandSayCharacterFieldItem";
import CommandSayCreateCharacterFieldModal from "./ModalCreateCharacter/CommandSayCreateCharacterFieldModal";

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
}: FormCharacterTypes) {
  const preventRerender = useRef<boolean>(false);

  const charactersRef = useRef<HTMLDivElement>(null);

  const { updateCharacterName } = usePlotfieldCommands();

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const currentInput = useRef<{ updateCharacterNameOnBlur: () => void }>(null);

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const handleOnBlur = () => {
    if (currentInput.current) {
      currentInput.current.updateCharacterNameOnBlur();
    }
  };

  useEffect(() => {
    if (characterValue._id && preventRerender.current) {
      updateNameOrEmotion.mutate({ characterBodyId: characterValue._id });
    }
    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  useOutOfModal({
    modalRef: charactersRef,
    setShowModal: setShowCharacters,
    showModal: showCharacters,
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnBlur();
        }}
        className={`${showCharacters ? "z-[10]" : ""} w-full relative`}
      >
        <PlotfieldInput
          onBlur={handleOnBlur}
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
              ...prev,
              characterName: e.target.value,
            }));
            updateCharacterName({
              id: plotFieldCommandId,
              characterName: e.target.value,
            });
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
          ref={currentInput}
          translateAsideValue={"translate-y-[.5rem]"}
          setShowCharacterModal={setShowCharacters}
          showCharacterModal={showCharacters}
          plotfieldCommandId={plotFieldCommandId}
          setCharacterValue={setCharacterValue}
          setEmotionValue={setEmotionValue}
          characterName={characterValue.characterName || ""}
          currentCharacterId={characterValue?._id || ""}
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
      />
    </>
  );
}
