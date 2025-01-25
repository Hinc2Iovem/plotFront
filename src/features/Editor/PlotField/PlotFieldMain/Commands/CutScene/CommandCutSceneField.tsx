import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandCutScene from "../../../hooks/CutScene/useGetCommandCutScene";
import useUpdateCutSceneText from "../../../hooks/CutScene/useUpdateCutSceneText";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandCutSceneFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandCutSceneField({ plotFieldCommandId, topologyBlockId }: CommandCutSceneFieldTypes) {
  const { episodeId } = useParams();
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandCutScene } = useGetCommandCutScene({
    plotFieldCommandId,
  });
  const [commandCutSceneId, setCommandCutSceneId] = useState("");

  const currentInput = useRef<HTMLInputElement | null>(null);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "cutScene",
    id: plotFieldCommandId,
    text: textValue,
    topologyBlockId,
    type: "command",
  });

  useEffect(() => {
    if (commandCutScene) {
      setCommandCutSceneId(commandCutScene._id);
      setTextValue(commandCutScene?.cutSceneName || "");
      setInitTextValue(commandCutScene?.cutSceneName || "");
    }
  }, [commandCutScene]);

  const updateCutSceneText = useUpdateCutSceneText({
    cutSceneId: commandCutSceneId,
    cutSceneName: textValue,
  });

  const onBlur = () => {
    if (initTextValue !== textValue) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "cutScene",
          id: plotFieldCommandId,
          type: "command",
          value: textValue,
        });
      }
      updateCutSceneText.mutate();
      setInitTextValue(textValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <FocusedPlotfieldCommandNameField nameValue={"cut scene"} plotFieldCommandId={plotFieldCommandId} />

      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
        <PlotfieldInput
          ref={currentInput}
          value={textValue}
          onBlur={onBlur}
          type="text"
          placeholder="Кат син"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
