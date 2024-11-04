import { useEffect, useState } from "react";
import checkIsCurrentFieldFocused from "../../../features/Editor/PlotField/utils/checkIsCurrentFieldFocused";

type CheckIsCurrentFieldFocusedTypes = {
  plotFieldCommandId: string;
  setIsFocusedIf?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useCheckIsCurrentFieldFocused({
  plotFieldCommandId,
  setIsFocusedIf,
}: CheckIsCurrentFieldFocusedTypes) {
  const [isCommandFocused, setIsCommandFocused] = useState(() =>
    checkIsCurrentFieldFocused({ itemId: plotFieldCommandId })
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        setIsCommandFocused(
          checkIsCurrentFieldFocused({
            itemId: plotFieldCommandId,
          })
        );

        if (setIsFocusedIf) {
          const currentCommand = sessionStorage
            .getItem("focusedCommand")
            ?.split("-");
          if ((currentCommand || [])[0] === "if") {
            setIsFocusedIf((currentCommand || [])[2] === "if" ? true : false);
          } else if ((currentCommand || [])[0] === "condition") {
            setIsFocusedIf((currentCommand || [])[2] === "if" ? true : false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [plotFieldCommandId]);

  useEffect(() => {
    const pressedKeys = new Set();
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (
        (pressedKeys.has("shift") && key === "arrowdown") ||
        (key === "arrowup" && pressedKeys.has("control"))
      ) {
        setIsCommandFocused(
          checkIsCurrentFieldFocused({
            itemId: plotFieldCommandId,
          })
        );
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [plotFieldCommandId]);

  useEffect(() => {
    const handleLateUpdates = () => {
      const currentFocusedCommand = sessionStorage
        .getItem("focusedCommand")
        ?.split("-");
      if ((currentFocusedCommand || [])[1] === plotFieldCommandId) {
        setIsCommandFocused(true);
      } else {
        setIsCommandFocused(false);
      }
    };
    window.addEventListener("storage", handleLateUpdates);
    return () => {
      window.removeEventListener("storage", handleLateUpdates);
    };
  }, [plotFieldCommandId]);

  return isCommandFocused;
}
