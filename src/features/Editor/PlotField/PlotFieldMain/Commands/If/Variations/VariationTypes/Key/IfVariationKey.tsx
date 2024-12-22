import { useEffect, useState } from "react";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetKeyById from "../../../../../../hooks/Key/useGetKeyById";
import IfFieldName from "../shared/IfFieldName";
import IfVariationKeyField from "./IfVariationKeyField";
import IfVariationNewKeyModal from "./IfVariationNewKeyModal";

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
  const [showCreateNewValueModal, setShowCreateNewValueModal] = useState(false);
  const [highlightRedOnValueNonExisting, setHighlightRedOnValueOnExisting] = useState(false);
  const [commandKeyId, setCommandKeyId] = useState(keyId || "");

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const [currentIfName, setCurrentIfName] = useState("");
  const [backUpIfName, setBackUpIfName] = useState("");

  const { data: commandKey } = useGetKeyById({ keyId: commandKeyId });

  useEffect(() => {
    if (commandKey) {
      setCurrentIfName(commandKey.text);
      setBackUpIfName(commandKey.text);
    }
  }, [commandKey]);

  useEffect(() => {
    if (keyId?.trim().length) {
      setCommandKeyId(keyId);
    }
  }, [keyId]);

  useAddItemInsideSearch({
    commandName: "If - Key",
    id: ifVariationId,
    text: currentIfName,
    topologyBlockId,
    type: "ifVariation",
  });

  return (
    <div className="relative w-full">
      <IfVariationKeyField
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
        backUpIfName={backUpIfName}
        currentIfName={currentIfName}
        highlightRedOnValueNonExisting={highlightRedOnValueNonExisting}
        setBackUpIfName={setBackUpIfName}
        setCommandKeyId={setCommandKeyId}
        setCurrentIfName={setCurrentIfName}
        setCurrentlyActive={setCurrentlyActive}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
      />

      <IfVariationNewKeyModal
        ifName={currentIfName}
        ifKeyId={ifVariationId}
        setHighlightRedOnValueOnExisting={setHighlightRedOnValueOnExisting}
        setShowCreateNewValueModal={setShowCreateNewValueModal}
        showCreateNewValueModal={showCreateNewValueModal}
      />

      <IfFieldName currentlyActive={currentlyActive} text="Ключ" />
    </div>
  );
}
