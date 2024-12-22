import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacteristic from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import { isNumeric } from "../../../../../../../../../utils/regExpIsNumeric";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionCharacteristic from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import useConditionBlocks from "../../../Context/ConditionContext";
import ConditionSignField from "../ConditionSignField";
import ConditionVariationCharacteristicModal from "./ConditionVariationCharacteristicModal";

type ConditionBlockVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  value: number | null;
  conditionBlockVariationId: string;
  firstCharacteristicId: string;
  topologyBlockId: string;
  secondCharacteristicId: string;
};

export default function ConditionBlockVariationCharacteristic({
  plotfieldCommandId,
  conditionBlockId,
  value,
  conditionBlockVariationId,
  topologyBlockId,
  secondCharacteristicId,
  firstCharacteristicId,
}: ConditionBlockVariationCharacteristicTypes) {
  const [showFirstCharacteristicPromptModal, setShowFirstCharacteristicPromptModal] = useState(false);
  const [showSecondCharacteristicPromptModal, setShowSecondCharacteristicPromptModal] = useState(false);
  const [hideModal, setHideModal] = useState<"first" | "second" | null>(null);

  const { getConditionBlockVariationById } = useConditionBlocks();
  const [currentSign, setCurrentSign] = useState(
    getConditionBlockVariationById({
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId: conditionBlockVariationId,
    })?.sign || ("" as ConditionSignTypes)
  );

  useEffect(() => {
    if (hideModal === "second") {
      setShowSecondCharacteristicPromptModal(false);
    } else if (hideModal === "first") {
      setShowFirstCharacteristicPromptModal(false);
    }
  }, [hideModal]);

  return (
    <div className="flex flex-col gap-[1rem] w-full">
      <div className="w-full flex gap-[.5rem] flex-shrink flex-wrap">
        <CharacteristicInputField
          key={"characteristic-1"}
          conditionBlockId={conditionBlockId}
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacteristicPromptModal={setShowFirstCharacteristicPromptModal}
          showCharacteristicPromptModal={showFirstCharacteristicPromptModal}
          fieldType="conditionName"
          conditionBlockVariationId={conditionBlockVariationId}
          currentCharacteristicId={firstCharacteristicId}
          setHideModal={setHideModal}
          topologyBlockId={topologyBlockId}
        />
        <div className="h-full">
          <ConditionSignField
            setCurrentSign={setCurrentSign}
            currentSign={currentSign}
            conditionBlockId={conditionBlockId}
            conditionBlockVariationId={conditionBlockVariationId}
            plotfieldCommandId={plotfieldCommandId}
            type="characteristic"
          />
        </div>
        <CharacteristicInputField
          key={"characteristic-2"}
          conditionBlockId={conditionBlockId}
          setShowCharacteristicPromptModal={setShowSecondCharacteristicPromptModal}
          showCharacteristicPromptModal={showSecondCharacteristicPromptModal}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="conditionValue"
          conditionBlockVariationId={conditionBlockVariationId}
          currentCharacteristicId={secondCharacteristicId}
          value={value}
          setHideModal={setHideModal}
          topologyBlockId={topologyBlockId}
        />
      </div>
    </div>
  );
}

type CharacteristicInputFieldTypes = {
  setShowCharacteristicPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHideModal: React.Dispatch<React.SetStateAction<"first" | "second" | null>>;
  showCharacteristicPromptModal: boolean;
  plotfieldCommandId: string;
  conditionBlockId: string;
  conditionBlockVariationId: string;
  currentCharacteristicId: string;
  topologyBlockId: string;
  value?: number | null;
  fieldType: "conditionName" | "conditionValue";
};

function CharacteristicInputField({
  setShowCharacteristicPromptModal,
  setHideModal,
  showCharacteristicPromptModal,
  plotfieldCommandId,
  conditionBlockId,
  fieldType,
  conditionBlockVariationId,
  currentCharacteristicId,
  value,
  topologyBlockId,
}: CharacteristicInputFieldTypes) {
  const { episodeId } = useParams();
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [currentConditionName, setCurrentConditionName] = useState<string | number>(value ? value : "");
  const [backUpConditionName, setBackUpConditionName] = useState<string | number>(value ? value : "");

  const [characteristicId, setCharacteristicId] = useState(currentCharacteristicId);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: characteristicId,
    language: "russian",
  });

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const updateConditionBlock = useUpdateConditionCharacteristic({
    conditionBlockCharacteristicId: conditionBlockVariationId,
  });

  useEffect(() => {
    if (translatedCharacteristic) {
      setCurrentConditionName((translatedCharacteristic.translations || [])[0]?.text);
      setBackUpConditionName((translatedCharacteristic.translations || [])[0]?.text);
    }
  }, [translatedCharacteristic, characteristicId]);

  useEffect(() => {
    // updates value for the second characteristic when it's a number
    if (isNumeric(currentConditionName.toString()) && fieldType === "conditionValue") {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        conditionValue: Number(currentConditionName),
      });

      updateConditionBlock.mutate({
        value: Number(currentConditionName),
      });
    }
  }, [currentConditionName, fieldType]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Characteristic",
    id: conditionBlockVariationId,
    text: typeof currentConditionName === "string" ? currentConditionName : currentConditionName.toString(),
    topologyBlockId,
    type: "conditionVariation",
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Characteristic",
        id: conditionBlockVariationId,
        value: typeof currentConditionName === "string" ? currentConditionName : currentConditionName.toString(),
        type: "conditionVariation",
      });
    }
  }, [currentConditionName, episodeId]);

  return (
    <div className="w-[40%] flex-grow min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        placeholder="Характеристика"
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
          if (fieldType === "conditionName") {
            setHideModal("second");
          } else {
            setHideModal("first");
          }
        }}
        value={currentConditionName}
        onChange={(e) => {
          if (!showCharacteristicPromptModal) {
            setShowCharacteristicPromptModal(true);
            if (fieldType === "conditionName") {
              setHideModal("second");
            } else {
              setHideModal("first");
            }
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? " " : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <ConditionVariationCharacteristicModal
        currentCharacteristic={currentConditionName}
        setCharacteristicId={setCharacteristicId}
        setBackUpCharacteristic={setBackUpConditionName}
        setCurrentCharacteristic={setCurrentConditionName}
        setShowCharacteristicPromptModal={setShowCharacteristicPromptModal}
        showCharacteristicPromptModal={showCharacteristicPromptModal}
        conditionBlockId={conditionBlockId}
        conditionBlockVariationId={conditionBlockVariationId}
        plotfieldCommandId={plotfieldCommandId}
        fieldType={fieldType}
        backUpCharacteristic={typeof backUpConditionName === "string" ? backUpConditionName : ""}
      />
    </div>
  );
}
