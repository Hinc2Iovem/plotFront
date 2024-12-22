import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetKeyById from "../../../../../../hooks/Key/useGetKeyById";
import ConditionBlockFieldName from "../shared/ConditionBlockFieldName";
import CreateNewValueModal from "./CreateNewKey";
import KeyPromptsModal, { ExposedMethodsKey } from "./KeyPromptsModal";

type ConditionBlockVariationKeyTypes = {
  plotfieldCommandId: string;
  conditionBlockId: string;
  keyId?: string;
  conditionBlockVariationId: string;
  topologyBlockId: string;
};

export default function ConditionBlockVariationKey({
  plotfieldCommandId,
  conditionBlockId,
  conditionBlockVariationId,
  keyId,
  topologyBlockId,
}: ConditionBlockVariationKeyTypes) {
  const { episodeId } = useParams();
  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [commandKeyId, setCommandKeyId] = useState(keyId || "");

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const [currentConditionName, setCurrentConditionName] = useState("");
  const [backUpConditionName, setBackUpConditionName] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  useEffect(() => {
    if (commandKey) {
      setCurrentConditionName(commandKey.text);
      setBackUpConditionName(commandKey.text);
    }
  }, [commandKey]);

  useEffect(() => {
    if (keyId?.trim().length) {
      setCommandKeyId(keyId);
    }
  }, [keyId]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Key",
    id: conditionBlockVariationId,
    text: currentConditionName,
    topologyBlockId,
    type: "conditionVariation",
  });

  const inputRef = useRef<ExposedMethodsKey>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateKeyOnBlur();
    }
  };

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Key",
        id: conditionBlockVariationId,
        type: "conditionVariation",
        value: value,
      });
    }
  };

  return (
    <div className="relative w-full">
      <PlotfieldInput
        type="text"
        onBlur={() => {
          setCurrentlyActive(false);
          onBlur();
        }}
        placeholder="Ключ"
        onClick={(e) => {
          e.stopPropagation();
          setShowKeyPromptModal((prev) => !prev);
          setCurrentlyActive(true);
        }}
        value={currentConditionName}
        onChange={(e) => {
          if (!showKeyPromptModal) {
            setShowKeyPromptModal(true);
          }
          setCurrentlyActive(true);
          setHighlightRedOnValueOnExisting(false);
          setCurrentConditionName(e.target.value);
          updateValues(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <KeyPromptsModal
        currentKeyName={currentConditionName}
        setCurrentKeyName={setCurrentConditionName}
        backUpConditionName={backUpConditionName}
        setBackUpConditionName={setBackUpConditionName}
        setShowKeyPromptModal={setShowKeyPromptModal}
        showKeyPromptModal={showKeyPromptModal}
        setCommandKeyId={setCommandKeyId}
        conditionBlockVariationId={conditionBlockVariationId}
        conditionBlockId={conditionBlockId}
        plotfieldCommandId={plotfieldCommandId}
        ref={inputRef}
      />

      <CreateNewValueModal
        conditionName={currentConditionName}
        conditionBlockKeyId={conditionBlockVariationId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />

      <ConditionBlockFieldName currentlyActive={currentlyActive} text="Ключ" />
    </div>
  );
}
