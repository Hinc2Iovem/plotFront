import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandAmbient from "../../../hooks/Ambient/useGetCommandAmbient";
import useUpdateAmbientText from "../../../hooks/Ambient/useUpdateAmbientText";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandAmbientFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandAmbientField({ plotFieldCommandId, topologyBlockId }: CommandAmbientFieldTypes) {
  const { episodeId } = useParams();
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandAmbient } = useGetCommandAmbient({
    plotFieldCommandId,
  });
  const [commandAmbientId, setCommandAmbientId] = useState("");

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
    commandName: "ambient",
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
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"ambient"}
        plotFieldCommandId={plotFieldCommandId}
      />

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
