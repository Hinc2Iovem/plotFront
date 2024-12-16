import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import PlotfieldInput from "../../../../../../../../ui/Inputs/PlotfieldInput";
import { DebouncedCheckCharacterTypes } from "../../../Choice/ChoiceQuestionField";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useConditionBlocks from "../../Context/ConditionContext";
import ConditionSignField from "./ConditionSignField";
import useGetCharacterById from "../../../../../../../../hooks/Fetching/Character/useGetCharacterById";
import useUpdateConditionCharacter from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import useGetTranslationCharacterById from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacterById";
import ConditionBlockFieldName from "./shared/ConditionBlockFieldName";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

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
  const { getConditionBlockVariationById, updateConditionBlockVariationValue } = useConditionBlocks();

  const [currentConditionName, setCurrentConditionName] = useState("");
  const [currentConditionValue, setCurrentConditionValue] = useState(
    getConditionBlockVariationById({
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId: conditionBlockCharacterId,
    })?.value || null
  );

  const [characterId, setCharacterId] = useState(currentCharacterId || "");

  const { data: currentCharacter } = useGetCharacterById({ characterId });
  const { data: translatedCharacter } = useGetTranslationCharacterById({ characterId, language: "russian" });

  const [characterImg, setCharacterImg] = useState("");
  const [debouncedCharacter, setDebouncedCharacter] = useState<DebouncedCheckCharacterTypes | null>(null);

  useEffect(() => {
    if (currentCharacter && characterImg !== currentCharacter.img) {
      setCharacterImg(currentCharacter?.img || "");
    }
  }, [currentCharacter, characterId]);

  useEffect(() => {
    if (translatedCharacter && currentConditionName !== (translatedCharacter?.translations || [])[0]?.text) {
      setCurrentConditionName((translatedCharacter?.translations || [])[0].text || "");
    }
  }, [translatedCharacter, characterId]);

  // const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const updateConditionBlock = useUpdateConditionCharacter({
    conditionBlockCharacterId,
  });

  const debouncedConditionName = useDebounce({
    delay: 700,
    value: currentConditionName,
  });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Condition - Character",
          id: conditionBlockCharacterId,
          text: `${debouncedConditionName} ${currentConditionValue}`,
          topologyBlockId,
          type: "conditionVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Character",
        id: conditionBlockCharacterId,
        value: `${debouncedConditionName} ${currentConditionValue}`,
        type: "conditionVariation",
      });
    }
  }, [debouncedConditionName, episodeId, currentConditionValue]);

  useEffect(() => {
    if (debouncedCharacter) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        characterId: debouncedCharacter.characterName,
        plotfieldCommandId,
        conditionBlockVariationId: conditionBlockCharacterId,
      });

      setCurrentConditionName(debouncedCharacter.characterName);
      setCharacterImg(debouncedCharacter?.characterImg || "");
      setCharacterId(debouncedCharacter.characterId);

      updateConditionBlock.mutate({
        characterId: debouncedCharacter.characterId,
      });
    } else {
      console.error("Such character doesn't exist");
    }
  }, [debouncedCharacter]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  return (
    <div className="w-full flex gap-[1rem] flex-col">
      <div className="w-full flex gap-[.5rem] flex-wrap">
        <div className="flex-grow min-w-[10rem] relative">
          <PlotfieldInput
            type="text"
            onBlur={() => {}}
            placeholder="Персонаж"
            onClick={(e) => {
              setShowCharacterPromptModal((prev) => !prev);
              e.stopPropagation();
            }}
            value={currentConditionName}
            onChange={(e) => {
              if (!showCharacterPromptModal) {
                setShowCharacterPromptModal(true);
              }
              setCurrentConditionName(e.target.value);
            }}
            className={`border-[3px] border-double border-dark-mid-gray `}
          />
          {characterImg ? (
            <img src={characterImg} alt="CharacterImg" className="w-[3rem] absolute right-[3px] rounded-md top-[3px]" />
          ) : null}
          <PlotfieldCharacterPromptMain
            characterValue={currentConditionName}
            setCharacterId={setCharacterId}
            setCharacterName={setCurrentConditionName}
            setShowCharacterModal={setShowCharacterPromptModal}
            showCharacterModal={showCharacterPromptModal}
            translateAsideValue="translate-y-[.5rem]"
            debouncedValue={debouncedConditionName}
            setCharacterImg={setCharacterImg}
            setDebouncedCharacter={setDebouncedCharacter}
            plotfieldCommandIfId=""
            isElse={false}
          />
        </div>

        <div className="w-[7rem]">
          <ConditionSignField
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
  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateConditionBlock = useUpdateConditionCharacter({
    conditionBlockCharacterId: conditionBlockVariationId,
  });

  return (
    <div className="min-w-[10rem] flex-grow relative">
      <PlotfieldInput
        type="text"
        onBlur={() => {
          setCurrentlyActive(false);
        }}
        onClick={() => {
          setCurrentlyActive(true);
        }}
        placeholder="Значение"
        value={currentConditionValue || ""}
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentlyActive(true);
          updateConditionBlock.mutate({ value: +e.target.value });
          setCurrentConditionValue(+e.target.value);

          updateConditionBlockVariationValue({
            plotfieldCommandId,
            conditionBlockId,
            conditionBlockVariationId,
            conditionValue: +e.target.value,
          });
        }}
        className={`text-[1.5rem] border-[3px] border-double border-dark-mid-gray `}
      />
      <ConditionBlockFieldName currentlyActive={currentlyActive} text="Персонаж" />
    </div>
  );
}
