import { useEffect, useRef, useState } from "react";
import useGetCommandAmbient from "../../../hooks/Ambient/useGetCommandAmbient";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateAmbientText from "../../../hooks/Ambient/useUpdateAmbientText";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";
import useSearch from "../../Search/SearchContext";
import { useParams } from "react-router-dom";

type CommandAmbientFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandAmbientField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandAmbientFieldTypes) {
  const { storyId } = useParams();
  const [nameValue] = useState<string>(command ?? "Ambient");
  const [textValue, setTextValue] = useState("");
  const { data: commandAmbient } = useGetCommandAmbient({
    plotFieldCommandId,
  });
  const [commandAmbientId, setCommandAmbientId] = useState("");
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const currentInput = useRef<HTMLInputElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });

  useEffect(() => {
    if (commandAmbient) {
      setCommandAmbientId(commandAmbient._id);
    }
  }, [commandAmbient]);

  useEffect(() => {
    if (commandAmbient?.ambientName) {
      setTextValue(commandAmbient.ambientName);
    }
  }, [commandAmbient]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (storyId) {
      addItem({
        storyId,
        item: {
          commandName: nameValue || "ambient",
          id: plotFieldCommandId,
          text: textValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [storyId]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateAmbientText = useUpdateAmbientText({
    ambientId: commandAmbientId,
    ambientName: debouncedValue,
  });

  useEffect(() => {
    if (commandAmbient?.ambientName !== debouncedValue && debouncedValue?.trim().length) {
      if (storyId) {
        updateValue({
          storyId,
          commandName: "ambient",
          id: plotFieldCommandId,
          type: "command",
          value: debouncedValue,
        });
      }
      updateAmbientText.mutate();
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
          type="text"
          value={textValue}
          ref={currentInput}
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
