import { useEffect, useState } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetCommandWait from "../../../hooks/Wait/useGetCommandWait";
import useUpdateWaitText from "../../../hooks/Wait/useUpdateWaitText";
import useSearch from "../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

type CommandWaitFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandWaitField({ plotFieldCommandId, command, topologyBlockId }: CommandWaitFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Wait");
  const [waitValue, setWaitValue] = useState("");
  const { data: commandWait } = useGetCommandWait({
    plotFieldCommandId,
  });
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [commandWaitId, setCommandWaitId] = useState("");

  useEffect(() => {
    if (commandWait && !commandWaitId?.trim().length) {
      setCommandWaitId(commandWait._id);
    }
  }, [commandWait]);

  useEffect(() => {
    if (commandWait?.waitValue) {
      setWaitValue(commandWait.waitValue.toString());
    }
  }, [commandWait]);

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "wait",
          id: plotFieldCommandId,
          text: waitValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  const updateWaitText = useUpdateWaitText({
    waitValue: Number(waitValue),
  });

  useEffect(() => {
    if (waitValue) {
      if (episodeId) {
        updateValue({ episodeId, commandName: "wait", id: plotFieldCommandId, type: "command", value: waitValue });
      }
      updateWaitText.mutate({
        waitId: commandWaitId || commandWait?._id || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitValue]);

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
          value={waitValue || ""}
          type="number"
          placeholder="Ожидание"
          onChange={(e) => setWaitValue(e.target.value)}
        />
      </form>
    </div>
  );
}
