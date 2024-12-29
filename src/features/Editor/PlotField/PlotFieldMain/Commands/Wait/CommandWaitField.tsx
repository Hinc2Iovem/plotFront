import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandWait from "../../../hooks/Wait/useGetCommandWait";
import useUpdateWaitText from "../../../hooks/Wait/useUpdateWaitText";

type CommandWaitFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandWaitField({ plotFieldCommandId, command, topologyBlockId }: CommandWaitFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Wait");
  const [initValue, setInitValue] = useState("");
  const [waitValue, setWaitValue] = useState("");
  const { data: commandWait } = useGetCommandWait({
    plotFieldCommandId,
  });
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

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
    commandName: nameValue || "wait",
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
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
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
