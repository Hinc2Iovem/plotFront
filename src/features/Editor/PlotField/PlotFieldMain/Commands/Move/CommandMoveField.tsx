import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandMove from "../../../hooks/Move/useGetCommandMove";
import useUpdateMoveText from "../../../hooks/Move/useUpdateMoveText";

type CommandMoveFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;

export default function CommandMoveField({ plotFieldCommandId, command, topologyBlockId }: CommandMoveFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Move");
  const [initValue, setInitValue] = useState<string>("");
  const [moveValue, setMoveValue] = useState<string>("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { data: commandMove } = useGetCommandMove({
    plotFieldCommandId,
  });
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const currentInput = useRef<HTMLInputElement | null>(null);

  const [commandMoveId, setCommandMoveId] = useState("");

  useEffect(() => {
    if (commandMove) {
      setCommandMoveId(commandMove._id);
      setMoveValue(commandMove?.moveValue || "");
      setInitValue(commandMove?.moveValue || "");
    }
  }, [commandMove]);

  const updateMoveText = useUpdateMoveText({
    moveValue,
    moveId: commandMoveId,
  });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: nameValue || "move",
    id: plotFieldCommandId,
    text: moveValue,
    topologyBlockId,
    type: "command",
  });

  const handleBlur = () => {
    if (moveValue.trim().length && currentInput.current && document.activeElement !== currentInput.current) {
      const fixIfZeroOrOne = moveValue === "0" ? "0.0" : moveValue === "1" ? "1.0" : moveValue;
      setMoveValue(fixIfZeroOrOne);

      if (episodeId) {
        updateValue({ episodeId, commandName: "move", id: plotFieldCommandId, type: "command", value: fixIfZeroOrOne });
      }

      if (regexCheckDecimalNumberBetweenZeroAndOne.test(fixIfZeroOrOne) && initValue !== moveValue) {
        setShowNotificationModal(false);
        updateMoveText.mutate();
        setInitValue(moveValue);
      } else {
        setShowNotificationModal(true);
      }
    }
  };
  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused
              ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
              : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow w-full">
        <PlotfieldInput
          ref={currentInput}
          onBlur={handleBlur}
          value={moveValue || ""}
          type="text"
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
