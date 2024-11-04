import { useEffect, useRef } from "react";

type CheckIfShowingPlotfieldInsideConditionOnMountTypes = {
  plotFieldCommandId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useCheckIfShowingPlotfieldInsideConditionOnMount({
  plotFieldCommandId,
  setIsFocusedBackground,
  setShowConditionBlockPlot,
}: CheckIfShowingPlotfieldInsideConditionOnMountTypes) {
  const onlyFirstRerender = useRef(true);

  useEffect(() => {
    if (onlyFirstRerender.current) {
      const focusedCommandCondition = sessionStorage
        .getItem("focusedCommandCondition")
        ?.split("?")
        .filter(Boolean);

      const deepLevelCommandCondition = focusedCommandCondition?.includes(
        "none"
      )
        ? null
        : (focusedCommandCondition?.length || 0) > 0
        ? (focusedCommandCondition?.length || 0) - 1
        : null;
      if (typeof deepLevelCommandCondition === "number") {
        const currentConditionCommand = (focusedCommandCondition || [])[
          deepLevelCommandCondition
        ].split("-");
        const currentPlotfieldCommandId = currentConditionCommand[1];

        if (currentPlotfieldCommandId === plotFieldCommandId) {
          setIsFocusedBackground(true);
          setShowConditionBlockPlot(true);
        } else {
          setIsFocusedBackground(false);
          setShowConditionBlockPlot(false);
        }
      }
    }

    return () => {
      onlyFirstRerender.current = false;
    };
  }, [plotFieldCommandId]);
}
