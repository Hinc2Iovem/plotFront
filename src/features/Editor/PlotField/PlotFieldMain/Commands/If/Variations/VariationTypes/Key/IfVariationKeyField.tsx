import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import IfVariationKeyPromptsModal, { ExposedMethodsIfKey } from "./IfVariationKeyPromptsModal";

type IfVariationKeyFieldTypes = {
  ifVariationId: string;
  currentIfName: string;
  backUpIfName: string;
  plotfieldCommandId: string;
  highlightRedOnValueNonExisting: boolean;
  setCurrentIfName: React.Dispatch<React.SetStateAction<string>>;
  setCommandKeyId: React.Dispatch<React.SetStateAction<string>>;
  setBackUpIfName: React.Dispatch<React.SetStateAction<string>>;
  setCurrentlyActive: React.Dispatch<React.SetStateAction<boolean>>;
  setHighlightRedOnValueOnExisting: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function IfVariationKeyField({
  ifVariationId,
  currentIfName,
  highlightRedOnValueNonExisting,
  plotfieldCommandId,
  backUpIfName,
  setCurrentIfName,
  setBackUpIfName,
  setCommandKeyId,
  setCurrentlyActive,
  setHighlightRedOnValueOnExisting,
}: IfVariationKeyFieldTypes) {
  const { episodeId } = useParams();
  const { updateValue } = useSearch();

  const [showKeyPromptModal, setShowKeyPromptModal] = useState(false);

  const inputRef = useRef<ExposedMethodsIfKey>(null);

  const onBlur = () => {
    if (inputRef.current) {
      inputRef.current.updateKeyValueOnBlur();
    }
  };

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
    <>
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
        value={currentIfName}
        onChange={(e) => {
          if (!showKeyPromptModal) {
            setShowKeyPromptModal(true);
          }
          setCurrentlyActive(true);
          setHighlightRedOnValueOnExisting(false);
          setCurrentIfName(e.target.value);
          updateValues(e.target.value);
        }}
        className={`${highlightRedOnValueNonExisting ? "" : ""} border-[3px] border-double border-dark-mid-gray`}
      />

      <IfVariationKeyPromptsModal
        currentKeyName={currentIfName}
        backUpIfName={backUpIfName}
        setCurrentKeyName={setCurrentIfName}
        setBackUpIfName={setBackUpIfName}
        setShowKeyPromptModal={setShowKeyPromptModal}
        showKeyPromptModal={showKeyPromptModal}
        setCommandKeyId={setCommandKeyId}
        ifVariationId={ifVariationId}
        plotfieldCommandId={plotfieldCommandId}
      />
    </>
  );
}
