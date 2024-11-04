import { useEffect, useRef } from "react";

type CheckIfShowingPlotfieldInsideChoiceOnMountTypes = {
  plotFieldCommandId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChoiceBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useCheckIfShowingPlotfieldInsideChoiceOnMount({
  plotFieldCommandId,
  setIsFocusedBackground,
  setShowChoiceBlockPlot,
}: CheckIfShowingPlotfieldInsideChoiceOnMountTypes) {
  const onlyFirstRerender = useRef(true);

  useEffect(() => {
    if (onlyFirstRerender.current) {
      const focusedCommandChoice = sessionStorage
        .getItem("focusedCommandChoice")
        ?.split("?")
        .filter(Boolean);

      const deepLevelCommandChoice = focusedCommandChoice?.includes("none")
        ? null
        : (focusedCommandChoice?.length || 0) > 0
        ? (focusedCommandChoice?.length || 0) - 1
        : null;
      if (typeof deepLevelCommandChoice === "number") {
        const currentChoiceCommand = (focusedCommandChoice || [])[
          deepLevelCommandChoice
        ].split("-");
        const currentPlotfieldCommandId = currentChoiceCommand[0];

        if (currentPlotfieldCommandId === plotFieldCommandId) {
          setIsFocusedBackground(true);
          setShowChoiceBlockPlot(true);
        } else {
          setIsFocusedBackground(false);
          setShowChoiceBlockPlot(false);
        }
      }
    }

    return () => {
      onlyFirstRerender.current = false;
    };
  }, [plotFieldCommandId]);
}
