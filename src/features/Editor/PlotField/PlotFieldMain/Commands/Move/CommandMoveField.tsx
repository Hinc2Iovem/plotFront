import { useEffect, useRef, useState } from "react";
import useGetCommandMove from "../../../hooks/Move/useGetCommandMove";
import useUpdateMoveText from "../../../hooks/Move/useUpdateMoveText";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import PlotfieldInput from "../../../../../shared/Inputs/PlotfieldInput";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";
import useSearch from "../../Search/SearchContext";
import { useParams } from "react-router-dom";

type CommandMoveFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;

export default function CommandMoveField({ plotFieldCommandId, command, topologyBlockId }: CommandMoveFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Move");
  const [moveValue, setMoveValue] = useState<string>("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const { data: commandMove } = useGetCommandMove({
    plotFieldCommandId,
  });
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const currentInput = useRef<HTMLInputElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });

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

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: nameValue || "move",
          id: plotFieldCommandId,
          text: moveValue,
          topologyBlockId,
          type: "command",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (moveValue.trim().length) {
      if (episodeId) {
        updateValue({ episodeId, commandName: "move", id: plotFieldCommandId, type: "command", value: moveValue });
      }
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
          ref={currentInput}
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
