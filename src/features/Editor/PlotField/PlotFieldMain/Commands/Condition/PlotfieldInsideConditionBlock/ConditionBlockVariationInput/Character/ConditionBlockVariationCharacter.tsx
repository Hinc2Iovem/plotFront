import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionCharacter from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import useGetCharacterWithTranslation from "../../../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import ConditionSignField from "../ConditionSignField";
import ConditionBlockFieldName from "../shared/ConditionBlockFieldName";
import ConditionVariationCharacterField from "./ConditionVariationCharacterField";
import useConditionBlocks from "../../../Context/ConditionContext";

type ConditionBlockVariationCharacterTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  currentCharacterId: string;
  topologyBlockId: string;
  conditionBlockCharacterId: string;
};

export default function ConditionBlockVariationCharacter({
  plotfieldCommandId,
  conditionBlockId,
  currentCharacterId,
  topologyBlockId,
  conditionBlockCharacterId,
}: ConditionBlockVariationCharacterTypes) {
  const { episodeId } = useParams();
  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);
  const getConditionBlockVariationById = useConditionBlocks((state) => state.getConditionBlockVariationById);

  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getConditionBlockVariationById({
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId: conditionBlockCharacterId,
    })?.sign || ("" as ConditionSignTypes)
  );

  const [currentConditionValue, setCurrentConditionValue] = useState(
    getConditionBlockVariationById({
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId: conditionBlockCharacterId,
    })?.value || null
  );

  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({ currentCharacterId });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Character",
    id: conditionBlockCharacterId,
    text: `${
      typeof characterValue.characterName === "string" ? characterValue.characterName : ""
    } ${currentSign} ${currentConditionValue}`,
    topologyBlockId,
    type: "conditionVariation",
  });

  const updateValues = () => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Character",
        id: conditionBlockCharacterId,
        value: `${
          typeof characterValue.characterName === "string" ? characterValue.characterName : ""
        } ${currentSign} ${currentConditionValue}`,
        type: "conditionVariation",
      });
    }
  };

  useEffect(() => {
    updateValues();
  }, [currentSign, characterValue.characterName]);

  return (
    <div className="w-full flex gap-[10px] flex-col">
      <div className="w-full flex gap-[5px] flex-wrap">
        <ConditionVariationCharacterField
          characterValue={characterValue}
          conditionBlockCharacterId={conditionBlockCharacterId}
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          setCharacterValue={setCharacterValue}
        />

        <div className="w-fit">
          <ConditionSignField
            currentSign={currentSign}
            setCurrentSign={setCurrentSign}
            conditionBlockId={conditionBlockId}
            plotfieldCommandId={plotfieldCommandId}
            conditionBlockVariationId={conditionBlockCharacterId}
            type="character"
          />
        </div>

        <ConditionValueField
          plotfieldCommandId={plotfieldCommandId}
          conditionBlockId={conditionBlockId}
          setShowCharacterPromptModal={setShowCharacterPromptModal}
          showCharacterPromptModal={showCharacterPromptModal}
          conditionBlockVariationId={conditionBlockCharacterId}
          setCurrentConditionValue={setCurrentConditionValue}
          currentConditionValue={currentConditionValue}
        />
      </div>
    </div>
  );
}

type ConditionValueFieldTypes = {
  plotfieldCommandId: string;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentConditionValue: React.Dispatch<React.SetStateAction<number | null>>;
  currentConditionValue: number | null;
  showCharacterPromptModal: boolean;
  conditionBlockId: string;
  conditionBlockVariationId: string;
};

function ConditionValueField({
  plotfieldCommandId,
  showCharacterPromptModal,
  conditionBlockId,
  conditionBlockVariationId,
  currentConditionValue,
  setCurrentConditionValue,
  setShowCharacterPromptModal,
}: ConditionValueFieldTypes) {
  const updateConditionBlockVariationValue = useConditionBlocks((state) => state.updateConditionBlockVariationValue);

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateConditionBlock = useUpdateConditionCharacter({
    conditionBlockCharacterId: conditionBlockVariationId,
  });

  return (
    <div className="min-w-[100px] flex-grow relative">
      <PlotfieldInput
        type="text"
        onBlur={() => {
          setCurrentlyActive(false);
        }}
        onClick={() => {
          setCurrentlyActive(true);
        }}
        placeholder="Значение(числа)"
        value={currentConditionValue || ""}
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentlyActive(true);
          setCurrentConditionValue(+e.target.value);

          updateConditionBlockVariationValue({
            plotfieldCommandId,
            conditionBlockId,
            conditionBlockVariationId,
            conditionValue: +e.target.value,
          });

          updateConditionBlock.mutate({ value: +e.target.value });
        }}
        className={`border-[3px] border-border text-text`}
      />
      <ConditionBlockFieldName currentlyActive={currentlyActive} text="Персонаж" />
    </div>
  );
}
