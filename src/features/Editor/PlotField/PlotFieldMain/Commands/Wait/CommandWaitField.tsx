import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandWait from "../../../hooks/Wait/useGetCommandWait";
import useUpdateWaitText from "../../../hooks/Wait/useUpdateWaitText";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandWaitFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandWaitField({ plotFieldCommandId, topologyBlockId }: CommandWaitFieldTypes) {
  const { episodeId } = useParams();
  const [initValue, setInitValue] = useState("");
  const [waitValue, setWaitValue] = useState("");
  const { data: commandWait } = useGetCommandWait({
    plotFieldCommandId,
  });

  const [commandWaitId, setCommandWaitId] = useState("");

  useEffect(() => {
    if (commandWait && !commandWaitId?.trim().length) {
      setCommandWaitId(commandWait._id);
      setWaitValue(commandWait?.waitValue?.toString());
      setInitValue(commandWait?.waitValue?.toString());
    }
  }, [commandWait, commandWaitId]);

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "wait",
    id: plotFieldCommandId,
    text: waitValue,
    topologyBlockId,
    type: "command",
  });

  const updateWaitText = useUpdateWaitText({
    waitValue: Number(waitValue),
  });

  const onBlur = () => {
    if (episodeId) {
      updateValue({ episodeId, commandName: "wait", id: plotFieldCommandId, type: "command", value: waitValue });
    }
    if (waitValue && waitValue !== initValue) {
      updateWaitText.mutate({
        waitId: commandWaitId || commandWait?._id || "",
      });
      setInitValue(waitValue);
    }
  };

  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"wait"}
        plotFieldCommandId={plotFieldCommandId}
      />

      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
        <PlotfieldInput
          onBlur={onBlur}
          value={waitValue || ""}
          type="number"
          placeholder="Ожидание"
          onChange={(e) => setWaitValue(e.target.value)}
        />
      </form>
    </div>
  );
}
