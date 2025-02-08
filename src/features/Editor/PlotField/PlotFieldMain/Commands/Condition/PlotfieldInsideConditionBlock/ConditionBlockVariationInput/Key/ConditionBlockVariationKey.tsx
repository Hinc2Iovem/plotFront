import useUpdateConditionKey from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionKey";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetKeyById from "../../../../../../hooks/Key/useGetKeyById";
import ConditionBlockFieldName from "../shared/ConditionBlockFieldName";
import KeyPromptsModal from "./KeyPromptsModal";
import useConditionBlocks from "../../../Context/ConditionContext";

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
  const updateConditionBlockVariationValue = useConditionBlocks((state) => state.updateConditionBlockVariationValue);

  const [commandKeyId, setCommandKeyId] = useState(keyId || "");
  const [initKeyId, setInitKeyId] = useState(keyId || "");

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const [currentConditionName, setCurrentConditionName] = useState("");
  const [initValue, setInitValue] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  useEffect(() => {
    if (commandKey) {
      setCurrentConditionName(commandKey.text);
      setInitValue(commandKey.text);
    }
  }, [commandKey]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Key",
    id: conditionBlockVariationId,
    text: currentConditionName,
    topologyBlockId,
    type: "conditionVariation",
  });

  const updateConditionBlock = useUpdateConditionKey({
    conditionBlockKeyId: conditionBlockVariationId || "",
  });

  useEffect(() => {
    if (commandKeyId && commandKeyId !== initKeyId) {
      setInitKeyId(commandKeyId);
      setInitValue(currentConditionName);
      updateConditionBlock.mutate({
        keyId: commandKeyId,
      });
    }
    updateConditionBlockVariationValue({
      commandKeyId: keyId,
      conditionBlockId,
      plotfieldCommandId,
      conditionBlockVariationId,
    });
  }, [commandKeyId, initKeyId]);

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
      <KeyPromptsModal
        onBlur={() => setCurrentlyActive(false)}
        currentKeyName={currentConditionName}
        setCurrentKeyName={setCurrentConditionName}
        setCommandKeyId={setCommandKeyId}
        onChange={(value) => updateValues(value)}
        initValue={initValue}
        setCurrentlyActive={setCurrentlyActive}
      />

      <ConditionBlockFieldName currentlyActive={currentlyActive} text="Ключ" />
    </div>
  );
}
