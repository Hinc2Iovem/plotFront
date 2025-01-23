import { useEffect } from "react";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";
import { preventCreatingCommandsWhenFocus } from "@/hooks/helpers/Plotfield/preventCreatingCommandsWhenFocus";

export default function useHandleDeletionOfCommand() {
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();

  useEffect(() => {
    if (!preventCreatingCommandsWhenFocus()) {
      return;
    }

    let isCtrlPressed = false;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();

      if (key === "control") {
        isCtrlPressed = true;
        return;
      }

      if (isCtrlPressed && key === "backspace") {
        event.preventDefault();
        const currentCommand = getItem("focusedCommand")?.split("-");

        if (currentCommand?.includes("none")) {
          console.log("And what are you deleting?");
          return;
        }

        const currentCommandPlotfieldId = (currentCommand || [])[1];
        const focusedCommandChoice = [""];
        const focusedCommandCondition = [""];

        if (
          focusedCommandChoice?.includes(currentCommandPlotfieldId) ||
          focusedCommandCondition?.includes(currentCommandPlotfieldId)
        ) {
          console.log("deleting not from here");
          return;
        }
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key?.toLowerCase() === "control") {
        isCtrlPressed = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [getItem]);
}
