import { useEffect, useRef } from "react";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/useUpdateNameOrEmotion";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes, EmotionTypes } from "./CommandSayCharacterFieldItem";
import CommandSayCreateCharacterFieldModal from "./ModalCreateCharacter/CommandSayCreateCharacterFieldModal";
import useGetCurrentFocusedElement from "@/features/Editor/PlotField/hooks/helpers/useGetCurrentFocusedElement";

type FormCharacterTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  setShowCreateCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
  showCreateCharacterModal: boolean;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;
};

export default function FormCharacter({
  plotFieldCommandId,
  plotFieldCommandSayId,
  setShowCreateCharacterModal,
  setEmotionValue,
  setCharacterValue,
  characterValue,
  showCreateCharacterModal,
}: FormCharacterTypes) {
  const preventRerender = useRef<boolean>(false);
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const { updateCharacterName } = usePlotfieldCommands();

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  useEffect(() => {
    if (characterValue._id && preventRerender.current) {
      updateNameOrEmotion.mutate({ characterBodyId: characterValue._id });
    }
    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  return (
    <>
      <div className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"} rounded-md w-full relative`}>
        <PlotfieldCharacterPromptMain
          onChange={(value) => {
            updateCharacterName({
              id: plotFieldCommandId,
              characterName: value,
            });
          }}
          characterValue={characterValue}
          plotfieldCommandId={plotFieldCommandId}
          setCharacterValue={setCharacterValue}
          setEmotionValue={setEmotionValue}
          characterName={characterValue.characterName || ""}
          currentCharacterId={characterValue?._id || ""}
        />
      </div>
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
