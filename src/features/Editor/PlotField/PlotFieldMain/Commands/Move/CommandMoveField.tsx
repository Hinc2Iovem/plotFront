import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandMove from "../../../hooks/Move/useGetCommandMove";
import useUpdateMoveText from "../../../hooks/Move/useUpdateMoveText";
import { toast } from "sonner";
import { toastErrorStyles } from "@/components/shared/toastStyles";

type CommandMoveFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;
const regexCheckDecimalNumberWithoutZeroAtBeginning = /^\.\d$/;

export default function CommandMoveField({ plotFieldCommandId, command, topologyBlockId }: CommandMoveFieldTypes) {
  const { episodeId } = useParams();
  const [nameValue] = useState<string>(command ?? "Move");
  const [moveValue, setMoveValue] = useState<string>("");
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
      let correctedValue = moveValue;
      if (regexCheckDecimalNumberWithoutZeroAtBeginning.test(moveValue)) {
        correctedValue = `0${moveValue}`;
      } else {
        correctedValue = moveValue === "0" ? "0.0" : moveValue === "1" ? "1.0" : moveValue;
      }
      setMoveValue(correctedValue);

      if (episodeId) {
        updateValue({ episodeId, commandName: "move", id: plotFieldCommandId, type: "command", value: correctedValue });
      }

      console.log("correctedValue: ", correctedValue);

      if (regexCheckDecimalNumberBetweenZeroAndOne.test(correctedValue)) {
        updateMoveText.mutate();
      } else {
        toast("Значение должно быть десятичным числом в промежутке от 0.0 до 1.0", toastErrorStyles);
      }
    }
  };
  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
        <PlotfieldInput
          ref={currentInput}
          onBlur={handleBlur}
          value={moveValue || ""}
          type="text"
          placeholder="Двигай"
          onChange={(e) => setMoveValue(e.target.value)}
        />
      </form>
    </div>
  );
}
