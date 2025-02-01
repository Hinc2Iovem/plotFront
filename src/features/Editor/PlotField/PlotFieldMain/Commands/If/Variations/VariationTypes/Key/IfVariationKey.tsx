import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetKeyById from "../../../../../../hooks/Key/useGetKeyById";
import KeyPromptsModal from "../../../../Condition/PlotfieldInsideConditionBlock/ConditionBlockVariationInput/Key/KeyPromptsModal";
import IfFieldName from "../shared/IfFieldName";
import useSearch from "@/features/Editor/Context/Search/SearchContext";
import useUpdateIfKey from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfKey";
import useCommandIf from "../../../Context/IfContext";

type IfVariationKeyTypes = {
  plotfieldCommandId: string;
  keyId?: string;
  ifVariationId: string;
  topologyBlockId: string;
};

export default function IfVariationKey({
  plotfieldCommandId,
  ifVariationId,
  keyId,
  topologyBlockId,
}: IfVariationKeyTypes) {
  const { episodeId } = useParams();
  const [commandKeyId, setCommandKeyId] = useState(keyId || "");
  const [initKeyId, setInitKeyId] = useState(keyId || "");
  const { updateIfVariationValue } = useCommandIf();

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const [currentIfName, setCurrentIfName] = useState("");
  const [initValue, setInitValue] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  useEffect(() => {
    if (commandKey) {
      setCurrentIfName(commandKey.text);
      setInitValue(commandKey.text);
    }
  }, [commandKey]);

  useEffect(() => {
    if (keyId?.trim().length) {
      setCommandKeyId(keyId);
      setInitKeyId(keyId);
    }
  }, [keyId]);

  useAddItemInsideSearch({
    commandName: "If - Key",
    id: ifVariationId,
    text: currentIfName,
    topologyBlockId,
    type: "ifVariation",
  });

  const updateIf = useUpdateIfKey({
    ifKeyId: ifVariationId || "",
  });

  useEffect(() => {
    if (commandKeyId && commandKeyId !== initKeyId) {
      setInitKeyId(commandKeyId);
      setInitValue(currentIfName);
      updateIf.mutate({
        keyId: commandKeyId,
      });
    }
    updateIfVariationValue({
      commandKeyId: commandKeyId,
      plotfieldCommandId,
      ifVariationId,
    });
  }, [commandKeyId, initKeyId]);

  const { updateValue } = useSearch();

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Key",
        id: ifVariationId,
        type: "ifVariation",
        value: value,
      });
    }
  };

  return (
    <div className="relative w-full">
      <KeyPromptsModal
        setCommandKeyId={setCommandKeyId}
        setCurrentlyActive={setCurrentlyActive}
        onBlur={() => setCurrentlyActive(false)}
        currentKeyName={currentIfName}
        setCurrentKeyName={setCurrentIfName}
        onChange={(value) => updateValues(value)}
        initValue={initValue}
      />

      <IfFieldName currentlyActive={currentlyActive} text="Ключ" />
    </div>
  );
}
