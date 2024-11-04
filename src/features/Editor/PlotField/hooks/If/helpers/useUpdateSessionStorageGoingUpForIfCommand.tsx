import { useEffect } from "react";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../Context/PlotfieldCommandIfSlice";

type UpdateSessionStorageGoingUpForIfCommandTypes = {
  commandIfId: string;
  plotfieldCommandId: string;
  getFirstCommandInsideIf: ({
    commandIfId,
    isElse,
  }: {
    commandIfId: string;
    isElse: boolean;
  }) => PlotfieldOptimisticCommandInsideIfTypes | null;
  updateFocuseReset: ({ value }: { value: boolean }) => void;
  updateFocuseIfReset: ({ value }: { value: boolean }) => void;
  setIsBackgroundFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useUpdateSessionStorageGoingUpForIfCommand({
  commandIfId,
  plotfieldCommandId,
  getFirstCommandInsideIf,
  setIsBackgroundFocused,
}: UpdateSessionStorageGoingUpForIfCommandTypes) {
  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (key === "arrowup" && pressedKeys.has("control")) {
        event.preventDefault();
        const currentFocusedCommandIf =
          sessionStorage.getItem("focusedCommandIf");

        if (currentFocusedCommandIf === "none") {
          console.log("You are already at the top level");
          return;
        }

        const focusedCommand = sessionStorage
          .getItem("focusedCommand")
          ?.split("-");

        const focusedCommandIf = sessionStorage
          .getItem("focusedCommandIf")
          ?.split("?")
          .filter(Boolean);

        const focusedCommandPlotfieldId = (focusedCommand || [])[1];

        if (currentFocusedCommandIf !== "none") {
          const deepLevelCommandIf = focusedCommandIf?.includes("none")
            ? null
            : (focusedCommandIf?.length || 0) > 0
            ? (focusedCommandIf?.length || 0) - 1
            : null;

          if (typeof deepLevelCommandIf === "number") {
            const currentFocusedCommandIfId = (focusedCommandIf || [])[
              deepLevelCommandIf
            ];
            const currentFocusedCommandIfPlotfieldCommandId =
              currentFocusedCommandIfId?.split("-")[1];

            const isCommandIf = currentFocusedCommandIfId?.split("-")[0];
            const currentFocusedCommandIfCommandIfId =
              currentFocusedCommandIfId?.split("-")[3];

            if (
              plotfieldCommandId !== currentFocusedCommandIfPlotfieldCommandId
            ) {
              console.log("Not for you");
              return;
            }

            if (deepLevelCommandIf === 0) {
              const currentFocuse = `${isCommandIf}-${currentFocusedCommandIfPlotfieldCommandId}-ifId-${currentFocusedCommandIfCommandIfId}`;

              if (
                focusedCommandPlotfieldId ===
                currentFocusedCommandIfPlotfieldCommandId
              ) {
                sessionStorage.setItem(
                  "focusedCommand",
                  `if-${currentFocusedCommandIfPlotfieldCommandId}-${isCommandIf}`
                );
                sessionStorage.setItem("focusedCommandIf", "none");
                setIsBackgroundFocused(false);
                return;
              } else {
                sessionStorage.setItem(
                  "focusedCommand",
                  `if-${currentFocusedCommandIfPlotfieldCommandId}-${
                    isCommandIf === "if" ? "if" : "else"
                  }`
                );
                setIsBackgroundFocused(true);
                sessionStorage.setItem("focusedCommandIf", `${currentFocuse}?`);
                return;
              }
            }

            if (
              currentFocusedCommandIfPlotfieldCommandId !==
              focusedCommandPlotfieldId
            ) {
              // Inside command if, focused on background
              if (deepLevelCommandIf === 0) {
                const newFocusedCommandIfArray = (focusedCommandIf || []).slice(
                  0,
                  -1
                );
                sessionStorage.setItem(
                  "focusedCommandIf",
                  newFocusedCommandIfArray.join("?")
                );
              } else {
                sessionStorage.setItem("focusedCommandIf", `none`);
              }
              sessionStorage.setItem(
                "focusedCommand",
                `if-${plotfieldCommandId}-${
                  isCommandIf === "if" ? "if" : "else"
                }`
              );

              setIsBackgroundFocused(false);
            } else {
              // Inside command if, focused on some command
              setIsBackgroundFocused(true);

              sessionStorage.setItem(
                "focusedCommand",
                `if-${plotfieldCommandId}-${
                  isCommandIf === "if" ? "if" : "else"
                }`
              );
            }
          } else {
            console.log("You are not inside if command, how did you do that");
            return;
          }
        }

        // updateFocuseIfReset({ value: false });
        // updateFocuseReset({ value: false });
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
  }, [commandIfId, getFirstCommandInsideIf, plotfieldCommandId]);
}

// const currentFocusedCommandIf =
//           sessionStorage.getItem("focusedCommandIf")

//         const newFocusedCommandIf = `${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${commandIfId}?`;

//         if (currentFocusedCommandIf !== newFocusedCommandIf) {
//           const combinedFocusedCommandIf =
//             currentFocusedCommandIf !== "none"
//               ? `${currentFocusedCommandIf}${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${commandIfId}?`
//               : `${focusedCommandIfOrElse}-${focusedCommandPlotfieldId}-ifId-${commandIfId}?`;

//           sessionStorage.setItem("focusedCommandIf", combinedFocusedCommandIf);
//           setIsBackgroundFocused(true);
//           return;
//         }
