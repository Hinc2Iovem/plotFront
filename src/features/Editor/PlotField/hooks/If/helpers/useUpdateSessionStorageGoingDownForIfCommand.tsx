import { useEffect } from "react";
import { GoingDownInsideIf } from "../../../../../../hooks/helpers/Plotfield/navigationHelpers/functions/ChecksForCommandIf";

type UpdateSessionStorageGoingDownForIfCommandTypes = {
  plotfieldCommandIfId: string;
  plotfieldCommandId: string;

  setIsBackgroundFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useUpdateSessionStorageGoingDownForIfCommand({
  plotfieldCommandIfId,
  plotfieldCommandId,
  setIsBackgroundFocused,
}: UpdateSessionStorageGoingDownForIfCommandTypes) {
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (key === "arrowdown" && pressedKeys.has("shift")) {
        event.preventDefault();
        const focusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        const focusedCommandIfOrElse = (focusedCommand || [])[2];
        const focusedCommandPlotfieldId = (focusedCommand || [])[1];
        if (plotfieldCommandId !== focusedCommandPlotfieldId) {
          console.log("Not for you");
          return;
        }

        const currentFocusedCommandIf = sessionStorage.getItem("focusedCommandIf");

        const newFocusedCommandIf = `${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${plotfieldCommandIfId}`;

        const focusedCommandInsideType = sessionStorage.getItem("focusedCommandInsideType");

        if (currentFocusedCommandIf === "none") {
          sessionStorage.setItem("focusedCommandIf", `${newFocusedCommandIf}?`);

          sessionStorage.setItem(
            "focusedCommandInsideType",
            `${focusedCommandInsideType}${plotfieldCommandId}-if-${focusedCommandIfOrElse === "if" ? "if" : "else"}?`
          );
          setIsBackgroundFocused(true);
          return;
        } else if (currentFocusedCommandIf !== "none") {
          const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

          const deepLevelCommandIf = focusedCommandIf?.includes("none")
            ? null
            : (focusedCommandIf?.length || 0) > 0
            ? (focusedCommandIf?.length || 0) - 1
            : null;

          if (typeof deepLevelCommandIf === "number") {
            const currentFocusedCommandIfId = (focusedCommandIf || [])[deepLevelCommandIf];

            if (currentFocusedCommandIfId !== newFocusedCommandIf) {
              sessionStorage.setItem("focusedCommandIf", `${currentFocusedCommandIf}${newFocusedCommandIf}?`);
              sessionStorage.setItem(
                "focusedCommandInsideType",
                `${focusedCommandInsideType}${plotfieldCommandId}-if-${
                  focusedCommandIfOrElse === "if" ? "if" : "else"
                }?`
              );
              setIsBackgroundFocused(true);
            } else {
              setIsBackgroundFocused(false);
              event.stopImmediatePropagation();
              // TODO getFirstCommandInsideIf
              GoingDownInsideIf({
                currentCommandId: plotfieldCommandIfId,
                insideIf: focusedCommandIfOrElse === "if",
                isGoingDown: true,
              });
            }
          } else {
            sessionStorage.setItem("focusedCommandIf", `${newFocusedCommandIf}?`);
            setIsBackgroundFocused(true);
          }
        }

        // updateFocuseReset({ value: false });
        // updateFocuseIfReset({ value: false });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [commandIfId, plotfieldCommandId]);
}

// const currentFocusedCommandIf =
//           sessionStorage.getItem("focusedCommandIf")

//         const newFocusedCommandIf = `${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${plotfieldCommandIfId}?`;

//         if (currentFocusedCommandIf !== newFocusedCommandIf) {
//           const combinedFocusedCommandIf =
//             currentFocusedCommandIf !== "none"
//               ? `${currentFocusedCommandIf}${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${plotfieldCommandIfId}?`
//               : `${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${plotfieldCommandIfId}?`;

//           sessionStorage.setItem("focusedCommandIf", combinedFocusedCommandIf);
//           setIsBackgroundFocused(true);
//           return;
//         }
