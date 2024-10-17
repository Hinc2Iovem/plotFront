import { useEffect, useState } from "react";
import useGetCommandKey from "../hooks/Key/useGetCommandKey";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateKeyText from "../hooks/Key/useUpdateKeyText";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";

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
        <PlotfieldCommandNameField>{nameValue}</PlotfieldCommandNameField>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="sm:w-[77%] flex-grow w-full"
      >
        <PlotfieldInput
          value={textValue}
          type="text"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
