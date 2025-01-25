import { toastErrorStyles } from "@/components/shared/toastStyles";
import useUpdateBackgroundText from "@/features/Editor/PlotField/hooks/Background/useUpdateBackgroundText";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
    setLocalMoveValue(moveValue);
  }, [moveValue]);

  const regexCheckDecimalNumberBetweenZeroAndOne = /^(0\.[0-9]|1\.0)$/;

  const updateBackgroundText = useUpdateBackgroundText({
    pointOfMovement: localMoveValue,
    backgroundId: commandBackgroundId,
  });

  const handleOnBlur = () => {
    if (localMoveValue?.trim().length) {
      if (regexCheckDecimalNumberBetweenZeroAndOne.test(localMoveValue)) {
        setMoveValue(localMoveValue);
        updateBackgroundText.mutate();
      } else {
        toast(` Значение должно быть десятичным числом в промежутке от 0.0 до 1.0`, toastErrorStyles);
      }
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="sm:w-[77%] flex-grow">
      <PlotfieldInput
        value={localMoveValue || ""}
        type="text"
        placeholder="Движение по локации"
        onChange={(e) => setLocalMoveValue(e.target.value)}
        onBlur={handleOnBlur}
      />
    </form>
  );
}
