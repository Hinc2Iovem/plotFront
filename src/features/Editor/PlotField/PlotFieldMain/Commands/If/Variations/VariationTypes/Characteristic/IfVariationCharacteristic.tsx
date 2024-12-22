import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacteristic from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import { isNumeric } from "../../../../../../../../../utils/regExpIsNumeric";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfCharacteristic from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";
import useIfVariations from "../../../Context/IfContext";
import IfSignField from "../../IfSignField";
import IfVariationCharacteristicModal, { ExposedMethodsIfCharacteristic } from "./IfVariationCharacteristicModal";

type IfVariationCharacteristicTypes = {
  plotfieldCommandId: string;
  value: number | null;
  ifVariationId: string;
  firstCharacteristicId: string;
  topologyBlockId: string;
  secondCharacteristicId: string;
};

export default function IfVariationCharacteristic({
  plotfieldCommandId,
  value,
  ifVariationId,
  topologyBlockId,
  secondCharacteristicId,
  firstCharacteristicId,
}: IfVariationCharacteristicTypes) {
  const [showFirstCharacteristicPromptModal, setShowFirstCharacteristicPromptModal] = useState(false);
  const [showSecondCharacteristicPromptModal, setShowSecondCharacteristicPromptModal] = useState(false);
  const [hideModal, setHideModal] = useState<"first" | "second" | null>(null);

  const { getIfVariationById } = useIfVariations();
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getIfVariationById({
      plotfieldCommandId,
      ifVariationId: ifVariationId,
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
          plotfieldCommandId={plotfieldCommandId}
          setShowCharacteristicPromptModal={setShowFirstCharacteristicPromptModal}
          showCharacteristicPromptModal={showFirstCharacteristicPromptModal}
          fieldType="ifName"
          ifVariationId={ifVariationId}
          currentCharacteristicId={firstCharacteristicId}
          setHideModal={setHideModal}
          topologyBlockId={topologyBlockId}
        />
        <div className="h-full">
          <IfSignField
            currentSign={currentSign}
            setCurrentSign={setCurrentSign}
            ifVariationId={ifVariationId}
            plotfieldCommandId={plotfieldCommandId}
            type="characteristic"
          />
        </div>
        <CharacteristicInputField
          key={"characteristic-2"}
          setShowCharacteristicPromptModal={setShowSecondCharacteristicPromptModal}
          showCharacteristicPromptModal={showSecondCharacteristicPromptModal}
          plotfieldCommandId={plotfieldCommandId}
          fieldType="ifValue"
          ifVariationId={ifVariationId}
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
  ifVariationId: string;
  currentCharacteristicId: string;
  topologyBlockId: string;
  value?: number | null;
  fieldType: "ifName" | "ifValue";
};

function CharacteristicInputField({
  setShowCharacteristicPromptModal,
  setHideModal,
  showCharacteristicPromptModal,
  plotfieldCommandId,
  fieldType,
  ifVariationId,
  currentCharacteristicId,
  value,
  topologyBlockId,
}: CharacteristicInputFieldTypes) {
  const { episodeId } = useParams();
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [currentIfName, setCurrentIfName] = useState<string | number>(value ? value : "");
  const [backUpIfName, setBackUpIfName] = useState<string | number>(value ? value : "");

  const [characteristicId, setCharacteristicId] = useState(currentCharacteristicId);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: characteristicId,
    language: "russian",
  });

  const { updateIfVariationValue } = useIfVariations();

  const updateIf = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });

  useEffect(() => {
    if (translatedCharacteristic) {
      setCurrentIfName((translatedCharacteristic.translations || [])[0]?.text);
      setBackUpIfName((translatedCharacteristic.translations || [])[0]?.text);
    }
  }, [translatedCharacteristic, characteristicId]);

  useEffect(() => {
    // updates value for the second characteristic when it's a number
    if (isNumeric(currentIfName.toString()) && fieldType === "ifValue") {
      updateIfVariationValue({
        plotfieldCommandId,
        ifVariationId,
        ifValue: Number(currentIfName),
      });

      updateIf.mutate({
        value: Number(currentIfName),
      });
    }
  }, [currentIfName, fieldType]);

  const inputRef = useRef<ExposedMethodsIfCharacteristic>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateCharacteristicOnBlur();
    }
  };

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Characteristic",
    id: ifVariationId,
    text: typeof currentIfName === "string" ? currentIfName : currentIfName.toString(),
    topologyBlockId,
    type: "ifVariation",
  });

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Characteristic",
        id: ifVariationId,
        value: value,
        type: "ifVariation",
      });
    }
  };

  return (
    <div className="w-[40%] flex-grow min-w-[10rem] relative">
      <PlotfieldInput
        type="text"
        placeholder="Характеристика"
        onBlur={onBlur}
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacteristicPromptModal((prev) => !prev);
          if (fieldType === "ifName") {
            setHideModal("second");
          } else {
            setHideModal("first");
          }
        }}
        value={currentIfName}
        onChange={(e) => {
          if (!showCharacteristicPromptModal) {
            setShowCharacteristicPromptModal(true);
            if (fieldType === "ifName") {
              setHideModal("second");
            } else {
              setHideModal("first");
            }
          }
          setHighlightRedOnValueOnExisting(false);
          setCurrentIfName(e.target.value);
          updateValues(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? " " : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <IfVariationCharacteristicModal
        currentCharacteristic={currentIfName}
        setCharacteristicId={setCharacteristicId}
        setBackUpCharacteristic={setBackUpIfName}
        setCurrentCharacteristic={setCurrentIfName}
        setShowCharacteristicPromptModal={setShowCharacteristicPromptModal}
        showCharacteristicPromptModal={showCharacteristicPromptModal}
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
        fieldType={fieldType}
        backUpCharacteristic={typeof backUpIfName === "string" ? backUpIfName : ""}
        characteristicId={characteristicId}
        ref={inputRef}
      />
    </div>
  );
}
