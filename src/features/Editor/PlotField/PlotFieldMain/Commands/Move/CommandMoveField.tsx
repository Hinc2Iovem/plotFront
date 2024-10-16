import { useEffect, useState } from "react";
import useGetCommandMove from "../hooks/Move/useGetCommandMove";
import useUpdateMoveText from "../hooks/Move/useUpdateMoveText";

type CommandMoveFieldTypes = {
  plotFieldCommandId: string;
  command: string;
};

const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;

export default function CommandMoveField({
  plotFieldCommandId,
  command,
}: CommandMoveFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Move");
  const [moveValue, setMoveValue] = useState<string>("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const theme = localStorage.getItem("theme");
  const { data: commandMove } = useGetCommandMove({
    plotFieldCommandId,
  });
  const [commandMoveId, setCommandMoveId] = useState("");

  useEffect(() => {
    if (commandMove) {
      setCommandMoveId(commandMove._id);
    }
  }, [commandMove]);

  useEffect(() => {
    if (commandMove?.moveValue) {
      setMoveValue(commandMove.moveValue);
    }
  }, [commandMove]);

  const updateMoveText = useUpdateMoveText({
    moveValue,
    moveId: commandMoveId,
  });

  useEffect(() => {
    if (moveValue.trim().length) {
      if (regexCheckDecimalNumberBetweenZeroAndOne.test(moveValue)) {
        setShowNotificationModal(false);
        updateMoveText.mutate();
      } else {
        setShowNotificationModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveValue]);

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
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
          value={moveValue || ""}
          type="text"
          className={`w-full ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-text-light text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]`}
          placeholder="Such a lovely day"
          onChange={(e) => setMoveValue(e.target.value)}
        />
      </form>
      <aside
        onClick={() => setShowNotificationModal(false)}
        className={`${
          showNotificationModal ? "" : "hidden"
        } absolute -translate-y-[2rem] right-0 bg-secondary shadow-md rounded-md border-red-400 border-[2px] border-dashed w-[70%] text-[1.4rem] p-[.5rem] text-right text-red-300`}
      >
        Значение должно быть десятичным числом в промежутке от 0.0 до 1.0
      </aside>
    </div>
  );
}
