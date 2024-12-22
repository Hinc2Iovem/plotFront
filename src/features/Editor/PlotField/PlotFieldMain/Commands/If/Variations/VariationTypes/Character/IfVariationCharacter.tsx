import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfCharacter from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacter";
import useGetCharacterWithTranslation from "../../../../../../hooks/helpers/CombineTranslationWithSource/useGetCharacterWithTranslation";
import PlotfieldCharacterPromptMain, {
  ExposedMethods,
} from "../../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import useIfVariations from "../../../Context/IfContext";
import IfSignField from "../../IfSignField";
import IfVariationValueField from "./IfVariationValueField";

type IfVariationCharacterTypes = {
  plotfieldCommandId: string;
  currentCharacterId: string;
  topologyBlockId: string;
  ifCharacterId: string;
};

export default function IfVariationCharacter({
  plotfieldCommandId,
  currentCharacterId,
  topologyBlockId,
  ifCharacterId,
}: IfVariationCharacterTypes) {
  const { episodeId } = useParams();
  const [showCharacterPromptModal, setShowCharacterPromptModal] = useState(false);
  const { getIfVariationById, updateIfVariationValue } = useIfVariations();
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifCharacterId,
    })?.sign || ("" as ConditionSignTypes)
  );
  const [currentIfValue, setCurrentIfValue] = useState(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifCharacterId,
    })?.value || null
  );

  const [initialCharacterId, setInitialCharacterId] = useState("");
  const { characterValue, setCharacterValue } = useGetCharacterWithTranslation({ currentCharacterId });

  useEffect(() => {
    if (typeof characterValue._id === "string" && characterValue && !initialCharacterId) {
      setInitialCharacterId(characterValue._id);
    }
  }, [characterValue]);

  const modalRef = useRef<HTMLDivElement>(null);

  const updateIf = useUpdateIfCharacter({
    ifCharacterId,
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Character",
    id: ifCharacterId,
    text: `${characterValue.characterName} ${currentIfValue}`,
    topologyBlockId,
    type: "ifVariation",
  });

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Character",
        id: ifCharacterId,
        value: value,
        type: "ifVariation",
      });
    }
  };

  const inputRef = useRef<ExposedMethods>(null);

  const updateCharacterValue = () => {
    if (characterValue) {
      setInitialCharacterId(characterValue._id || "");

      updateIfVariationValue({
        characterId: characterValue.characterName || "",
        plotfieldCommandId,
        ifVariationId: ifCharacterId,
      });

      updateIf.mutate({
        characterId: characterValue._id || "",
      });
    } else {
      console.error("Such character doesn't exist");
    }
  };

  useEffect(() => {
    if (characterValue._id !== initialCharacterId) {
      updateCharacterValue();
    }
  }, [characterValue._id]);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterPromptModal,
    showModal: showCharacterPromptModal,
  });

  return (
    <div className="w-full flex gap-[1rem] flex-col">
      <div className="w-full flex gap-[.5rem]">
        <div className="flex-grow min-w-[10rem] relative">
          <PlotfieldInput
            type="text"
            onBlur={() => {}}
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
              updateValues(
                `${
                  typeof characterValue.characterName === "string" ? characterValue.characterName : ""
                } ${currentIfValue}`
              );
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

        <div className="w-[7rem]">
          <IfSignField
            setCurrentSign={setCurrentSign}
            currentSign={currentSign}
            plotfieldCommandId={plotfieldCommandId}
            ifVariationId={ifCharacterId}
            type="character"
          />
        </div>

        <IfVariationValueField
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacterPromptModal={setShowCharacterPromptModal}
          showCharacterPromptModal={showCharacterPromptModal}
          ifVariationId={ifCharacterId}
          setCurrentIfValue={setCurrentIfValue}
          currentIfValue={currentIfValue}
        />
      </div>
    </div>
  );
}
