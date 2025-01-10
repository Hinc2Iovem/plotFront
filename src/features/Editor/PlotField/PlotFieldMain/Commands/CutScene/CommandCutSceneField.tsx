import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useGetCommandCutScene from "../../../hooks/CutScene/useGetCommandCutScene";
import useUpdateCutSceneText from "../../../hooks/CutScene/useUpdateCutSceneText";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandCutSceneFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandCutSceneField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandCutSceneFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "CutScene");
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandCutScene } = useGetCommandCutScene({
    plotFieldCommandId,
  });
  const [commandCutSceneId, setCommandCutSceneId] = useState("");
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const currentInput = useRef<HTMLInputElement | null>(null);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "cutScene",
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
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
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
