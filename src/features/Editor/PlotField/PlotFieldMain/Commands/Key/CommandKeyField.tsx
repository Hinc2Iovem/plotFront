import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetKeyByPlotfieldCommandId from "../../../hooks/Key/useGetKeyByPlotfieldCommandId";
import useUpdateKeyText from "../../../hooks/Key/useUpdateKeyText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandKeyFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandKeyField({ plotFieldCommandId, topologyBlockId, command }: CommandKeyFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Key");
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandKey } = useGetKeyByPlotfieldCommandId({
    plotFieldCommandId,
  });
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const currentInput = useRef<HTMLInputElement | null>(null);

  const [commandKeyId, setCommandKeyId] = useState("");

  useEffect(() => {
    if (commandKey) {
      setCommandKeyId(commandKey._id);
      setTextValue(commandKey?.text || "");
      setInitTextValue(commandKey?.text || "");
    }
  }, [commandKey]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "key",
    id: plotFieldCommandId,
    text: textValue,
    topologyBlockId,
    type: "command",
  });

  const updateKeyText = useUpdateKeyText({
    keyId: commandKeyId,
    text: textValue,
  });

  const onBlur = () => {
    if (initTextValue === textValue) {
      return;
    }
    if (episodeId) {
      updateValue({ episodeId, commandName: "key", id: plotFieldCommandId, type: "command", value: textValue });
    }
    updateKeyText.mutate();
    setInitTextValue(textValue);
  };

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          ref={currentInput}
          onBlur={onBlur}
          value={textValue}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
