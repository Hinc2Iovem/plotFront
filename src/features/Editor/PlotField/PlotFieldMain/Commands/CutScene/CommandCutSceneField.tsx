import { useEffect, useRef, useState } from "react";
import useGetCommandCutScene from "../../../hooks/CutScene/useGetCommandCutScene";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateCutSceneText from "../../../hooks/CutScene/useUpdateCutSceneText";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";

type CommandCutSceneFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandCutSceneField({ plotFieldCommandId, command }: CommandCutSceneFieldTypes) {
  const [nameValue] = useState<string>(command ?? "CutScene");
  const [textValue, setTextValue] = useState("");
  const { data: commandCutScene } = useGetCommandCutScene({
    plotFieldCommandId,
  });
  const [commandCutSceneId, setCommandCutSceneId] = useState("");
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const currentInput = useRef<HTMLInputElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });

  useEffect(() => {
    if (commandCutScene) {
      setCommandCutSceneId(commandCutScene._id);
    }
  }, [commandCutScene]);

  useEffect(() => {
    if (commandCutScene?.cutSceneName) {
      setTextValue(commandCutScene.cutSceneName);
    }
  }, [commandCutScene]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateCutSceneText = useUpdateCutSceneText({
    cutSceneId: commandCutSceneId,
    cutSceneName: debouncedValue,
  });

  useEffect(() => {
    if (commandCutScene?.cutSceneName !== debouncedValue && debouncedValue?.trim().length) {
      updateCutSceneText.mutate();
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
