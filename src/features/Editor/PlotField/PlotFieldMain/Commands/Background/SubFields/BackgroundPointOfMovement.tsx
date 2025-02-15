import { toastErrorStyles } from "@/components/shared/toastStyles";
import useUpdateBackgroundText from "@/features/Editor/PlotField/hooks/Background/useUpdateBackgroundText";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  regexCheckDecimalNumberBetweenZeroAndOne,
  regexCheckDecimalNumberWithoutZeroAtBeginning,
} from "../../Move/CommandMoveField";

type BackgroundPointOfMovementTypes = {
  setMoveValue: React.Dispatch<React.SetStateAction<string>>;
  moveValue: string;
  commandBackgroundId: string;
};

export default function BackgroundPointOfMovement({
  moveValue,
  commandBackgroundId,
  setMoveValue,
}: BackgroundPointOfMovementTypes) {
  const [localMoveValue, setLocalMoveValue] = useState(moveValue || "");

  useEffect(() => {
    if (!localMoveValue) {
      setLocalMoveValue(moveValue);
    }
  }, [moveValue]);

  const currentInput = useRef<HTMLInputElement | null>(null);

  const updateBackgroundText = useUpdateBackgroundText({
    pointOfMovement: localMoveValue,
    backgroundId: commandBackgroundId,
  });

  const handleOnBlur = () => {
    if (localMoveValue.trim().length && currentInput.current && document.activeElement !== currentInput.current) {
      let correctedValue = localMoveValue;
      if (regexCheckDecimalNumberWithoutZeroAtBeginning.test(localMoveValue)) {
        correctedValue = `0${localMoveValue}`;
      } else {
        correctedValue = localMoveValue === "0" ? "0.0" : localMoveValue === "1" ? "1.0" : localMoveValue;
      }

      setLocalMoveValue(correctedValue);
      setMoveValue(correctedValue);

      if (regexCheckDecimalNumberBetweenZeroAndOne.test(correctedValue)) {
        setMoveValue(localMoveValue);
        updateBackgroundText.mutate();
      } else {
        toast("Значение должно быть десятичным числом в промежутке от 0.0 до 1.0", toastErrorStyles);
      }
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
      <PlotfieldInput
        value={localMoveValue || ""}
        ref={currentInput}
        type="text"
        placeholder="Движение по локации"
        onChange={(e) => setLocalMoveValue(e.target.value)}
        onBlur={handleOnBlur}
      />
    </form>
  );
}
