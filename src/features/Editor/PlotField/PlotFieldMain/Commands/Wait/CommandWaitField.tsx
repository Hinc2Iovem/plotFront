import { useEffect, useState } from "react";
import useGetCommandWait from "../hooks/Wait/useGetCommandWait";
import useUpdateWaitText from "../hooks/Wait/useUpdateWaitText";

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
  const theme = localStorage.getItem("theme");
  const { data: commandWait } = useGetCommandWait({
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
        <h3 className="text-[1.3rem] text-text-light text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary cursor-default">
          {nameValue}
        </h3>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full"
      >
        <input
          value={waitValue || ""}
          type="number"
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`}
          placeholder="Ожидание"
          onChange={(e) => setWaitValue(e.target.value)}
        />
      </form>
    </div>
  );
}
