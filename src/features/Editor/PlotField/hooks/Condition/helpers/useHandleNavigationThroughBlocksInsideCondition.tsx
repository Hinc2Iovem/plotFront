import { useEffect } from "react";
import useConditionBlocks from "../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";
import { fromFirstToLastBlock } from "./functions/NavigationThroughBlocks/fromFirstToLastBlock";
import { fromLastToFirstBlock } from "./functions/NavigationThroughBlocks/fromLastToFirstBlock";
import { navigateBetweenBlocks } from "./functions/NavigationThroughBlocks/navigateBetweenBlocks";

type HandleNavigationThroughBlocksInsideConditionTypes = {
  plotfieldCommandId: string;
};

export default function useHandleNavigationThroughBlocksInsideCondition({
  plotfieldCommandId,
}: HandleNavigationThroughBlocksInsideConditionTypes) {
  const {
    getAmountOfConditionBlocks,
    getIndexOfConditionBlockById,
    getConditionBlockByIndex,
    updateCurrentlyOpenConditionBlock,
  } = useConditionBlocks();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if ((key === "arrowdown" && !pressedKeys.has("shift")) || (key === "arrowup" && !pressedKeys.has("control"))) {
        const focusedCommandCondition = sessionStorage.getItem("focusedCommandCondition")?.split("?").filter(Boolean);

        const focusedConditionBlocks = sessionStorage.getItem("focusedConditionBlock")?.split("?").filter(Boolean);

        const focusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        const focusedCommandPlotfieldId = (focusedCommand || [])[1];

        const deepLevelCommandCondition = focusedCommandCondition?.includes("none")
          ? null
          : (focusedCommandCondition?.length || 0) > 0
          ? (focusedCommandCondition?.length || 0) - 1
          : null;

        const deepLevelConditionBlocks = focusedConditionBlocks?.includes("none")
          ? null
          : (focusedConditionBlocks?.length || 0) > 0
          ? (focusedConditionBlocks?.length || 0) - 1
          : null;

        if (typeof deepLevelCommandCondition === "number") {
          const currentFocusedCommandCondition = (focusedCommandCondition || [])[deepLevelCommandCondition]?.split("-");
          const currentFocusedCommandConditionPlotfieldId = currentFocusedCommandCondition[1];
          const currentFocusedCommandConditionId = currentFocusedCommandCondition[3];

          if (currentFocusedCommandConditionPlotfieldId !== plotfieldCommandId) {
            console.log("Not for you");
            return;
          }

          if (focusedCommandPlotfieldId !== currentFocusedCommandConditionPlotfieldId) {
            console.log("It means another function with the same was triggered");
            return;
          }

          if (
            focusedCommandCondition?.includes("none") &&
            focusedCommandPlotfieldId !== currentFocusedCommandConditionPlotfieldId
          ) {
            console.log("You are not at the top level of condition command");
            return;
          }

          if (typeof deepLevelConditionBlocks === "number") {
            const currentFocusedConditionBlock = (focusedConditionBlocks || [])[deepLevelConditionBlocks]?.split("-");
            const currentFocusedConditionBlockId = currentFocusedConditionBlock[1];

            const indexOfCurrentBlock = getIndexOfConditionBlockById({
              conditionBlockId: currentFocusedConditionBlockId?.trim(),
              plotfieldCommandId: currentFocusedCommandConditionPlotfieldId?.trim(),
            });
            const currentAmountOfBlocks = getAmountOfConditionBlocks({
              plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
            });

            if (
              typeof indexOfCurrentBlock !== "number" ||
              indexOfCurrentBlock < 0 ||
              indexOfCurrentBlock > currentAmountOfBlocks
            ) {
              console.log("Extremely bad, you should be here.");
              return;
            }

            if (indexOfCurrentBlock === 0 && key === "arrowdown") {
              fromFirstToLastBlock({
                currentAmountOfBlocks,
                currentFocusedCommandConditionPlotfieldId,
                currentFocusedConditionBlockId,
                getConditionBlockByIndex,
                updateCurrentlyOpenConditionBlock,
                deepLevelConditionBlocks,
                currentFocusedCommandConditionId,
              });
            } else if (indexOfCurrentBlock === currentAmountOfBlocks - 1 && key === "arrowup") {
              fromLastToFirstBlock({
                currentFocusedCommandConditionPlotfieldId,
                currentFocusedConditionBlockId,
                getConditionBlockByIndex,
                updateCurrentlyOpenConditionBlock,
                deepLevelConditionBlocks,
                currentFocusedCommandConditionId,
              });
            } else {
              navigateBetweenBlocks({
                currentFocusedCommandConditionPlotfieldId,
                currentIndex: indexOfCurrentBlock,
                getConditionBlockByIndex,
                updateCurrentlyOpenConditionBlock,
                deepLevelConditionBlocks,
                isArrowDown: key === "arrowdown",
                currentFocusedCommandConditionId,
              });
            }
          }
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
  }, [
    plotfieldCommandId,
    getConditionBlockByIndex,
    getAmountOfConditionBlocks,
    getIndexOfConditionBlockById,
    updateCurrentlyOpenConditionBlock,
  ]);
}
