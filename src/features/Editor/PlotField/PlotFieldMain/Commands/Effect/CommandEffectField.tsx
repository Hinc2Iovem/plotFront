import { useEffect, useRef, useState } from "react";
import useGetCommandEffect from "../../../hooks/Effect/useGetCommandEffect";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateEffectText from "../../../hooks/Effect/useUpdateEffectText";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";

type CommandEffectFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandEffectField({ plotFieldCommandId, command }: CommandEffectFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Effect");
  const [textValue, setTextValue] = useState("");
  const { data: commandEffect } = useGetCommandEffect({
    plotFieldCommandId,
  });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const currentInput = useRef<HTMLInputElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });

  const [commandEffectId, setCommandEffectId] = useState("");

  useEffect(() => {
    if (commandEffect) {
      setCommandEffectId(commandEffect._id);
    }
  }, [commandEffect]);

  useEffect(() => {
    if (commandEffect?.effectName) {
      setTextValue(commandEffect.effectName);
    }
  }, [commandEffect]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateEffectText = useUpdateEffectText({
    effectId: commandEffectId,
    effectName: debouncedValue,
  });

  useEffect(() => {
    if (commandEffect?.effectName !== debouncedValue && debouncedValue?.trim().length) {
      updateEffectText.mutate();
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
