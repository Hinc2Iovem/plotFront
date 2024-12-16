import { useEffect, useRef, useState } from "react";
import useGetCommandEffect from "../../../hooks/Effect/useGetCommandEffect";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateEffectText from "../../../hooks/Effect/useUpdateEffectText";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useSearch from "../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

type CommandEffectFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandEffectField({ plotFieldCommandId, command, topologyBlockId }: CommandEffectFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Effect");
  const [textValue, setTextValue] = useState("");
  const { data: commandEffect } = useGetCommandEffect({
    plotFieldCommandId,
  });

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const currentInput = useRef<HTMLInputElement | null>(null);

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

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "effect",
          id: plotFieldCommandId,
          text: textValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (commandEffect?.effectName !== debouncedValue && debouncedValue?.trim().length) {
      if (episodeId) {
        updateValue({
          episodeId,
          commandName: "effect",
          id: plotFieldCommandId,
          type: "command",
          value: debouncedValue,
        });
      }
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
