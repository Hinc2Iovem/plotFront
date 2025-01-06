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
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused
              ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
              : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          ref={currentInput}
          value={textValue}
          onBlur={onBlur}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
