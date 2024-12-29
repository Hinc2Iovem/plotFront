import { useEffect } from "react";
import useTypedSessionStorage, {
  SessionStorageKeys,
} from "../../../../../hooks/helpers/shared/SessionStorage/useTypedSessionStorage";

export default function useHandleDeletionOfCommand() {
  const { getItem } = useTypedSessionStorage<SessionStorageKeys>();
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (pressedKeys.has("control") && key === "backspace") {
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
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
