import { useEffect, useState } from "react";
import useGetCommandCutScene from "../hooks/CutScene/useGetCommandCutScene";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import useUpdateCutSceneText from "../hooks/CutScene/useUpdateCutSceneText";

type CommandCutSceneFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

export default function CommandCutSceneField({
  plotFieldCommandId,
  command,
}: CommandCutSceneFieldTypes) {
  const [nameValue] = useState<string>(command ?? "CutScene");
  const [textValue, setTextValue] = useState("");

  const { data: commandCutScene } = useGetCommandCutScene({
    plotFieldCommandId,
  });
  const [commandCutSceneId, setCommandCutSceneId] = useState("");

  useEffect(() => {
    if (commandCutScene) {
      setCommandCutSceneId(commandCutScene._id);
    }
  }, [commandCutScene]);

  useEffect(() => {
    if (commandCutScene?.cutSceneName) {
      setTextValue(commandCutScene.cutSceneName);
    }
  }, [commandCutScene]);

  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  const updateCutSceneText = useUpdateCutSceneText({
    cutSceneId: commandCutSceneId,
    cutSceneName: debouncedValue,
  });

  useEffect(() => {
    if (
      commandCutScene?.cutSceneName !== debouncedValue &&
      debouncedValue?.trim().length
    ) {
      updateCutSceneText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default">
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
          className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
