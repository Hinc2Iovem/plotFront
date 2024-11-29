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
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);
      if (key === "arrowup" && pressedKeys.has("control")) {
        event.preventDefault();
        const currentFocusedCommandIf = sessionStorage.getItem("focusedCommandIf");

        if (currentFocusedCommandIf === "none") {
          console.log("You are already at the top level");
          return;
        }

        const focusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

        const focusedCommandInsideType = sessionStorage.getItem("focusedCommandInsideType")?.split("?").filter(Boolean);

        const focusedCommandPlotfieldId = (focusedCommand || [])[1];

        const deepLevelCommandIf = focusedCommandIf?.includes("none")
          ? null
          : (focusedCommandIf?.length || 0) > 0
          ? (focusedCommandIf?.length || 0) - 1
          : null;

        const deepLevelCommandInsideType =
          (focusedCommandInsideType?.length || 0) > 1 ? (focusedCommandInsideType?.length || 0) - 1 : 1;

        if (typeof deepLevelCommandIf === "number") {
          const currentFocusedCommandIfId = (focusedCommandIf || [])[deepLevelCommandIf];
          const currentFocusedCommandIfPlotfieldCommandId = currentFocusedCommandIfId?.split("-")[1];

          if (plotfieldCommandId !== currentFocusedCommandIfPlotfieldCommandId) {
            console.log("Not for you");
            return;
          }

          // going completely out of if
          if (focusedCommandPlotfieldId === currentFocusedCommandIfPlotfieldCommandId) {
            const newFocusedCommandIfArray = (focusedCommandIf || []).slice(0, -1);

            if (deepLevelCommandIf === 0) {
              sessionStorage.setItem("focusedCommandIf", "none");
            } else {
              sessionStorage.setItem("focusedCommandIf", `${newFocusedCommandIfArray?.join("?")}?`);
            }

            const currentFocusedCommandInsideType = (focusedCommandInsideType || [])[deepLevelCommandInsideType]?.split(
              "-"
            );
            const isIfOrElse = currentFocusedCommandInsideType[1];

            sessionStorage.setItem("focusedCommand", `if-${currentFocusedCommandIfPlotfieldCommandId}-${isIfOrElse}`);

            const newFocusedCommandInsideType = (focusedCommandInsideType || [])?.slice(0, -1);

            sessionStorage.setItem("focusedCommandInsideType", `${newFocusedCommandInsideType?.join("?")}?`);

            setIsBackgroundFocused(false);
            event.stopImmediatePropagation();
            return;
          } else {
            // going to the top level
            const currentFocusedCommandInsideType = (focusedCommandInsideType || [])[deepLevelCommandInsideType]?.split(
              "-"
            );
            const isIfOrElse = currentFocusedCommandInsideType[1];

            sessionStorage.setItem("focusedCommand", `if-${currentFocusedCommandIfPlotfieldCommandId}-${isIfOrElse}`);

            setIsBackgroundFocused(true);
            return;
          }
        } else {
          console.log("You are not inside if command, how did you do that");
          return;
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
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
