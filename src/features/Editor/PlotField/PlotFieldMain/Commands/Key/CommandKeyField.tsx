import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateCommandKey from "../../../hooks/Key/update/useUpdateCommandKey";
import useGetKeyByPlotfieldCommandId from "../../../hooks/Key/useGetKeyByPlotfieldCommandId";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandKeyFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandKeyField({ plotFieldCommandId, topologyBlockId }: CommandKeyFieldTypes) {
  const { episodeId } = useParams();
  const [initTextValue, setInitTextValue] = useState("");
  const [currentKey, setCurrentKey] = useState({
    textValue: "",
    id: "",
  });
  const { data: commandKey } = useGetKeyByPlotfieldCommandId({
    plotFieldCommandId,
  });

  const currentInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (commandKey) {
      setCurrentKey((prev) => ({
        ...prev,
        id: commandKey?._id || "",
        textValue: commandKey.text || "",
      }));
      setInitTextValue(commandKey?.text || "");
    }
  }, [commandKey]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "key",
    id: plotFieldCommandId,
    text: currentKey.textValue,
    topologyBlockId,
    type: "command",
  });

  const { mutate: updateKeyText, isSuccess } = useUpdateCommandKey({
    plotFieldCommandId,
    setCurrentKey,
  });

  const onBlur = () => {
    if (initTextValue === currentKey.textValue) {
      return;
    }
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "key",
        id: plotFieldCommandId,
        type: "command",
        value: currentKey.textValue,
      });
    }

    updateKeyText({ text: currentKey.textValue });
  };

  useEffect(() => {
    if (isSuccess) {
      setInitTextValue(currentKey.textValue);
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <FocusedPlotfieldCommandNameField nameValue={"key"} plotFieldCommandId={plotFieldCommandId} />
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
        <PlotfieldInput
          ref={currentInput}
          onBlur={onBlur}
          value={currentKey.textValue}
          type="text"
          placeholder="Кий"
          onChange={(e) =>
            setCurrentKey((prev) => ({
              ...prev,
              textValue: e.target.value,
            }))
          }
        />
      </form>
    </div>
  );
}
