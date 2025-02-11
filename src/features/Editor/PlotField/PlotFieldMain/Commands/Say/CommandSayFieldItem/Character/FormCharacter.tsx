import useGetCurrentFocusedElement from "@/features/Editor/PlotField/hooks/helpers/useGetCurrentFocusedElement";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../hooks/Say/patch/useUpdateNameOrEmotion";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes, EmotionTypes } from "./CommandSayCharacterFieldItem";

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
  characterValue,
  setEmotionValue,
  setCharacterValue,
}: FormCharacterTypes) {
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const { updateCharacterName, updateCharacterProperties, updateEmotionProperties } = usePlotfieldCommands();

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const handleOnBlur = (value: CharacterValueTypes) => {
    updateCharacterName({
      id: plotFieldCommandId,
      characterName: value.characterName || "",
    });
    setCharacterValue(value);
    updateNameOrEmotion.mutate({ characterBodyId: value._id || "" });
    if (setEmotionValue) {
      setEmotionValue({
        _id: null,
        emotionName: null,
        imgUrl: null,
      });
      updateEmotionProperties({
        emotionId: "",
        emotionName: "",
        id: plotFieldCommandId || "",
        emotionImg: "",
      });
    }
    updateCharacterProperties({
      characterId: value?._id || "",
      characterName: value.characterName || "",
      id: plotFieldCommandId || "",
      characterImg: value?.imgUrl || "",
    });
  };

  return (
    <>
      <div className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"} rounded-md w-full relative`}>
        <PlotfieldCharacterPromptMain onBlur={(value) => handleOnBlur(value)} initCharacterValue={characterValue} />
      </div>
      {/* <CommandSayCreateCharacterFieldModal
        characterName={characterValue.characterName || ""}
        characterId={characterValue?._id || ""}
        commandSayId={plotFieldCommandSayId}
        plotFieldCommandId={plotFieldCommandId}
        setShowModal={setShowCreateCharacterModal}
        showModal={showCreateCharacterModal}
        setCharacterValue={setCharacterValue}
      /> */}
    </>
  );
}
