import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandEffect from "../../../hooks/Effect/useGetCommandEffect";
import useUpdateEffectText from "../../../hooks/Effect/useUpdateEffectText";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandEffectFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandEffectField({ plotFieldCommandId, topologyBlockId }: CommandEffectFieldTypes) {
  const { episodeId } = useParams();
  const [initTextValue, setInitTextValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const { data: commandEffect } = useGetCommandEffect({
    plotFieldCommandId,
  });

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
    commandName: "effect",
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
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"effect"}
        plotFieldCommandId={plotFieldCommandId}
      />

      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
        <PlotfieldInput
          ref={currentInput}
          onBlur={onBlur}
          value={textValue}
          type="text"
          placeholder="Эффекто"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
