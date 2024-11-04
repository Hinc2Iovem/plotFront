import { useEffect, useState } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetCommandWait from "../../../hooks/Wait/useGetCommandWait";
import useUpdateWaitText from "../../../hooks/Wait/useUpdateWaitText";

type CommandWaitFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandWaitField({
  plotFieldCommandId,
  command,
}: CommandWaitFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Wait");
  const [waitValue, setWaitValue] = useState("");
  const { data: commandWait } = useGetCommandWait({
    plotFieldCommandId,
  });
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
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

  const updateWaitText = useUpdateWaitText({
    waitValue: Number(waitValue),
  });

  useEffect(() => {
    if (waitValue) {
      updateWaitText.mutate({
        waitId: commandWaitId || commandWait?._id || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full"
      >
        <PlotfieldInput
          value={waitValue || ""}
          type="number"
          placeholder="Ожидание"
          onChange={(e) => setWaitValue(e.target.value)}
        />
      </form>
    </div>
  );
}
