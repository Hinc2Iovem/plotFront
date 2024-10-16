import { useEffect, useState } from "react";
import useGetCommandKey from "../hooks/Key/useGetCommandKey";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateKeyText from "../hooks/Key/useUpdateKeyText";

type CommandKeyFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandKeyField({
  plotFieldCommandId,
  command,
}: CommandKeyFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Key");
  const [textValue, setTextValue] = useState("");
  const theme = localStorage.getItem("theme");
  const { data: commandKey } = useGetCommandKey({
    plotFieldCommandId,
  });
  const [commandKeyId, setCommandKeyId] = useState("");

  useEffect(() => {
    if (commandKey) {
      setCommandKeyId(commandKey._id);
    }
  }, [commandKey]);

  useEffect(() => {
    if (commandKey?.text) {
      setTextValue(commandKey.text);
    }
  }, [commandKey]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateKeyText = useUpdateKeyText({
    commandKeyId,
    text: debouncedValue,
  });

  useEffect(() => {
    if (commandKey?.text !== debouncedValue && debouncedValue?.trim().length) {
      updateKeyText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
          value={textValue}
          type="text"
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`}
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
