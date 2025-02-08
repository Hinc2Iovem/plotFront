import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacteristic from "../../../../../../../../../hooks/Fetching/Translation/useGetTranslationCharacteristic";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { isNumeric } from "../../../../../../../../../utils/regExpIsNumeric";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateConditionCharacteristic from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import ConditionSignField from "../ConditionSignField";
import ConditionVariationCharacteristicModal from "./ConditionVariationCharacteristicModal";
import useConditionBlocks from "../../../Context/ConditionContext";

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

  const getConditionBlockVariationById = useConditionBlocks((state) => state.getConditionBlockVariationById);

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
    <div className="flex flex-col gap-[10px] w-full">
      <div className="w-full flex gap-[5px] flex-shrink flex-wrap">
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
        <div className="w-fit">
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
  plotfieldCommandId,
  conditionBlockId,
  fieldType,
  conditionBlockVariationId,
  currentCharacteristicId,
  value,
  topologyBlockId,
}: CharacteristicInputFieldTypes) {
  const { episodeId } = useParams();
  const [currentConditionName, setCurrentConditionName] = useState<string | number>(value ? value : "");
  const [initValue, setInitValue] = useState<string | number>(value ? value : "");
  const [update, setUpdate] = useState(false);
  const [characteristicId, setCharacteristicId] = useState(currentCharacteristicId);

  const { data: translatedCharacteristic } = useGetTranslationCharacteristic({
    characteristicId: characteristicId,
    language: "russian",
  });

  const updateConditionBlockVariationValue = useConditionBlocks((state) => state.updateConditionBlockVariationValue);

  const updateConditionBlock = useUpdateConditionCharacteristic({
    conditionBlockCharacteristicId: conditionBlockVariationId,
  });

  useEffect(() => {
    if (translatedCharacteristic) {
      setCurrentConditionName((translatedCharacteristic.translations || [])[0]?.text);
      setInitValue((translatedCharacteristic.translations || [])[0]?.text);
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

  useEffect(() => {
    if (update) {
      updateConditionBlockVariationValue({
        conditionBlockId,
        plotfieldCommandId,
        conditionBlockVariationId,
        characteristicId,
      });

      updateConditionBlock.mutate({
        characteristicId: fieldType === "conditionName" ? characteristicId : null,
        secondCharacteristicId: fieldType === "conditionValue" ? characteristicId : null,
      });
      setUpdate(false);
    }
  }, [update]);
  return (
    <div className="w-[40%] flex-grow min-w-[100px] relative">
      <ConditionVariationCharacteristicModal<string | number>
        currentCharacteristic={currentConditionName}
        setCharacteristicId={setCharacteristicId}
        setCurrentCharacteristic={setCurrentConditionName}
        initValue={initValue}
        setInitValue={setInitValue}
        setUpdate={setUpdate}
      />
    </div>
  );
}
