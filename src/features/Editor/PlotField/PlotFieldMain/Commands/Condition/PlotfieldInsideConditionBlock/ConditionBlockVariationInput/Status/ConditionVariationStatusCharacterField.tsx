import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useUpdateConditionStatus from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionStatus";
import PlotfieldCharacterPromptMain, {
  type ExposedMethods,
} from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import { CharacterValueTypes } from "../../../../Say/CommandSayFieldItem/Character/CommandSayCharacterFieldItem";
import useConditionBlocks from "../../../Context/ConditionContext";

type ConditionVariationStatusCharacterFieldTypes = {
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  characterValue: CharacterValueTypes;
  conditionBlockId: string;
  conditionBlockVariationId: string;
  plotfieldCommandId: string;
};

export default function ConditionVariationStatusCharacterField({
  conditionBlockVariationId,
  plotfieldCommandId,
  conditionBlockId,
  characterValue,
  setCharacterValue,
}: ConditionVariationStatusCharacterFieldTypes) {
  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);
  const { updateConditionBlockVariationValue } = useConditionBlocks();
  const preventRerender = useRef(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ExposedMethods>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacterNameOnBlur();
    }
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  const updateConditionStatus = useUpdateConditionStatus({ conditionBlockStatusId: conditionBlockVariationId });

  useEffect(() => {
    if (characterValue && preventRerender) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        conditionBlockVariationId,
        plotfieldCommandId,
        characterId: characterValue._id || "",
      });

      if (typeof characterValue._id === "string") {
        updateConditionStatus.mutate({ characterId: characterValue._id });
      }
    }
    return () => {
      preventRerender.current = true;
    };
  }, [characterValue]);

  return (
    <div className="relative w-full">
      <PlotfieldInput
        type="text"
        placeholder="Персонаж"
        className="border-[3px] border-double border-dark-mid-gray"
        onClick={(e) => {
          setShowCharacterPromptModal((prev) => !prev);
          e.stopPropagation();
        }}
        onBlur={onBlur}
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
      />
      {characterValue.imgUrl?.trim().length ? (
        <img
          src={characterValue.imgUrl}
          alt="CharacterImg"
          className="w-[3rem] absolute right-[5px] rounded-md top-[0px] translate-y-[3px]"
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
