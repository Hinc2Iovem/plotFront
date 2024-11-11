import { useEffect } from "react";

export default function useHandleDeletionOfCommand() {
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (pressedKeys.has("control") && key === "backspace") {
        event.preventDefault();
        const currentCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        if (currentCommand?.includes("none")) {
          console.log("And what are you deleting?");
          return;
        }

        const currentCommandPlotfieldId = (currentCommand || [])[1];
        const focusedCommandChoice = sessionStorage.getItem("focusedCommandChoice")?.split("?").filter(Boolean);
        const focusedCommandCondition = sessionStorage.getItem("focusedCommandCondition")?.split("?").filter(Boolean);

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
      pressedKeys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
}
