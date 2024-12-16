import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandAmbient from "../../../hooks/Ambient/useGetCommandAmbient";
import useUpdateAmbientText from "../../../hooks/Ambient/useUpdateAmbientText";

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
  const [textValue, setTextValue] = useState("");
  const { data: commandAmbient } = useGetCommandAmbient({
    plotFieldCommandId,
  });
  const [commandAmbientId, setCommandAmbientId] = useState("");
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  const currentInput = useRef<HTMLInputElement | null>(null);

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
    if (commandAmbient?.ambientName !== textValue) {
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
    }
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
          type="text"
          onBlur={onBlur}
          value={textValue}
          ref={currentInput}
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
