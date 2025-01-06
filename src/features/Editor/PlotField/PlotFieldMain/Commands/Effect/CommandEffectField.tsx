import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandEffect from "../../../hooks/Effect/useGetCommandEffect";
import useUpdateEffectText from "../../../hooks/Effect/useUpdateEffectText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandEffectFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandEffectField({ plotFieldCommandId, command, topologyBlockId }: CommandEffectFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Effect");
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandEffect } = useGetCommandEffect({
    plotFieldCommandId,
  });

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const currentInput = useRef<HTMLInputElement | null>(null);

  const [commandEffectId, setCommandEffectId] = useState("");

  useEffect(() => {
    if (commandEffect) {
      setCommandEffectId(commandEffect._id);
      setTextValue(commandEffect?.effectName || "");
      setInitTextValue(commandEffect?.effectName || "");
    }
  }, [commandEffect]);

  const updateEffectText = useUpdateEffectText({
    effectId: commandEffectId,
    effectName: textValue,
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "effect",
    id: plotFieldCommandId,
    text: textValue,
    topologyBlockId,
    type: "command",
  });

  const onBlur = () => {
    if (initTextValue === textValue) {
      return;
    }

    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "effect",
        id: plotFieldCommandId,
        type: "command",
        value: textValue,
      });
    }
    updateEffectText.mutate();

    setInitTextValue(textValue);
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
          onBlur={onBlur}
          value={textValue}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
