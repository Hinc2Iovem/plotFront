import { useEffect, useRef, useState } from "react";
import useGetKeyByPlotfieldCommandId from "../../../hooks/Key/useGetKeyByPlotfieldCommandId";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateKeyText from "../../../hooks/Key/useUpdateKeyText";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";
import useSearch from "../../Search/SearchContext";
import { useParams } from "react-router-dom";

type CommandKeyFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandKeyField({ plotFieldCommandId, topologyBlockId, command }: CommandKeyFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Key");
  const [textValue, setTextValue] = useState("");
  const { data: commandKey } = useGetKeyByPlotfieldCommandId({
    plotFieldCommandId,
  });
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const currentInput = useRef<HTMLInputElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [commandKeyId, setCommandKeyId] = useState("");

  useEffect(() => {
    if (commandKey) {
      setCommandKeyId(commandKey._id);
    }
  }, [commandKey]);

  useEffect(() => {
    if (commandKey?.text) {
      setTextValue(commandKey.text);
    }
  }, [commandKey]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "key",
          id: plotFieldCommandId,
          text: textValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateKeyText = useUpdateKeyText({
    keyId: commandKeyId,
    text: debouncedValue,
  });

  useEffect(() => {
    if (commandKey?.text !== debouncedValue && debouncedValue?.trim().length) {
      if (episodeId) {
        updateValue({ episodeId, commandName: "key", id: plotFieldCommandId, type: "command", value: debouncedValue });
      }
      updateKeyText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          ref={currentInput}
          value={textValue}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
