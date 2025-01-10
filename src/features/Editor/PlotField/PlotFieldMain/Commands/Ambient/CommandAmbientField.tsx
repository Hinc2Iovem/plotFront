import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandAmbient from "../../../hooks/Ambient/useGetCommandAmbient";
import useUpdateAmbientText from "../../../hooks/Ambient/useUpdateAmbientText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

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
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Ambient");
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandAmbient } = useGetCommandAmbient({
    plotFieldCommandId,
  });
  const [commandAmbientId, setCommandAmbientId] = useState("");
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const currentInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (commandAmbient) {
      setCommandAmbientId(commandAmbient._id);
      setTextValue(commandAmbient?.ambientName || "");
      setInitTextValue(commandAmbient?.ambientName || "");
    }
  }, [commandAmbient]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "ambient",
    id: plotFieldCommandId,
    text: textValue,
    topologyBlockId,
    type: "command",
  });

  const updateAmbientText = useUpdateAmbientText({
    ambientId: commandAmbientId,
    ambientName: textValue,
  });

  const onBlur = () => {
    if (initTextValue !== textValue) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "ambient",
          id: plotFieldCommandId,
          type: "command",
          value: textValue,
        });
      }
      updateAmbientText.mutate();
      setInitTextValue(textValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
        <PlotfieldInput
          type="text"
          onBlur={onBlur}
          value={textValue}
          ref={currentInput}
          placeholder="Амбиенте"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
