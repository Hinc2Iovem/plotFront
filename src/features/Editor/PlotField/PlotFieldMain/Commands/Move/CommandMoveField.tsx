import { toastErrorStyles } from "@/components/shared/toastStyles";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import PlotfieldInput from "../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandMove from "../../../hooks/Move/useGetCommandMove";
import useUpdateMoveText from "../../../hooks/Move/useUpdateMoveText";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";

type CommandMoveFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;
export const regexCheckDecimalNumberWithoutZeroAtBeginning = /^\.\d$/;

export default function CommandMoveField({ plotFieldCommandId, topologyBlockId }: CommandMoveFieldTypes) {
  const { episodeId } = useParams();
  const [moveValue, setMoveValue] = useState<string>("");
  const { data: commandMove } = useGetCommandMove({
    plotFieldCommandId,
  });

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
    commandName: "move",
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

      if (regexCheckDecimalNumberBetweenZeroAndOne.test(correctedValue)) {
        updateMoveText.mutate();
      } else {
        toast("Значение должно быть десятичным числом в промежутке от 0.0 до 1.0", toastErrorStyles);
      }
    }
  };
  return (
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col relative">
      <FocusedPlotfieldCommandNameField
        topologyBlockId={topologyBlockId}
        nameValue={"move"}
        plotFieldCommandId={plotFieldCommandId}
      />

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
