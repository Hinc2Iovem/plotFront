import { useEffect, useRef } from "react";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateConditionCharacter from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import PlotfieldCharacterPromptMain, {
  ExposedMethods,
} from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useConditionBlocks from "../../../Context/ConditionContext";

type ConditionVariationCharacterFieldTypes = {
  conditionBlockCharacterId: string;
  plotfieldCommandId: string;
  conditionBlockId: string;
  characterValue: CharacterValueTypes;
  showCharacterPromptModal: boolean;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
};

export default function ConditionVariationCharacterField({
  characterValue,
  conditionBlockId,
  plotfieldCommandId,
  showCharacterPromptModal,
  conditionBlockCharacterId,
  setCharacterValue,
  setShowCharacterPromptModal,
}: ConditionVariationCharacterFieldTypes) {
  const { updateConditionBlockVariationValue } = useConditionBlocks();
  const preventRerender = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ExposedMethods>(null);

  const updateConditionBlock = useUpdateConditionCharacter({
    conditionBlockCharacterId,
  });

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacterNameOnBlur();
    }
  };

  useEffect(() => {
    if (characterValue && preventRerender.current) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        characterId: characterValue.characterName || "",
        plotfieldCommandId,
        conditionBlockVariationId: conditionBlockCharacterId,
      });
      updateConditionBlock.mutate({
        characterId: characterValue._id || "",
      });
    }

    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });
  return (
    <div className="flex-grow min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        onBlur={onBlur}
        placeholder="Персонаж"
        onClick={(e) => {
          setShowCharacterPromptModal((prev) => !prev);
          e.stopPropagation();
        }}
        value={characterValue.characterName || ""}
        onChange={(e) => {
          if (!showCharacterPromptModal) {
            setShowCharacterPromptModal(true);
          }
          setCharacterValue((prev) => ({
            ...prev,
            characterName: e.target.value,
          }));
        }}
        className={`border-[3px] border-double border-dark-mid-gray `}
      />
      {characterValue.imgUrl ? (
        <img
          src={characterValue.imgUrl}
          alt="CharacterImg"
          className="w-[3rem] absolute right-[3px] rounded-md top-[3px]"
        />
      ) : null}
      <PlotfieldCharacterPromptMain
        setShowCharacterModal={setShowCharacterPromptModal}
        showCharacterModal={showCharacterPromptModal}
        translateAsideValue="translate-y-[.5rem]"
        characterName={characterValue.characterName || ""}
        currentCharacterId={characterValue._id || ""}
        setCharacterValue={setCharacterValue}
        ref={inputRef}
      />
    </div>
  );
}
