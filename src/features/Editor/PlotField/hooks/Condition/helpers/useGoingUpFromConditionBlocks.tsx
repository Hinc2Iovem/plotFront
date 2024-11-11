import { useEffect } from "react";
import useConditionBlocks from "../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";

type GoingUpFromConditionBlocksTypes = {
  plotfieldCommandId: string;
  conditionId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useGoingUpFromConditionBlocks({
  setShowConditionBlockPlot,
  setIsFocusedBackground,
  plotfieldCommandId,
  conditionId,
}: GoingUpFromConditionBlocksTypes) {
  const {
    getFirstConditionBlockWithTopologyBlockId,
    updateCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlock,
  } = useConditionBlocks();

  const { getFirstCommandByTopologyBlockId, getCommandIfByPlotfieldCommandId, getCommandOnlyByPlotfieldCommandId } =
    usePlotfieldCommands();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleGoingDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (key === "arrowup" && pressedKeys.has("control")) {
        const currentFocusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        const currentFocusedCommandIsElse = (currentFocusedCommand || [])[2];
        const currentFocusedCommandPlotfieldCommandId = (currentFocusedCommand || [])[1];
        const focusedCommandCondition = sessionStorage.getItem("focusedCommandCondition")?.split("?").filter(Boolean);

        const focusedConditionBlocks = sessionStorage.getItem("focusedConditionBlock")?.split("?").filter(Boolean);

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

          if (currentFocusedCommandConditionPlotfieldId !== plotfieldCommandId) {
            console.log("Not for you");
            return;
          }

          event.stopPropagation();

          if (currentFocusedCommandConditionPlotfieldId === currentFocusedCommandPlotfieldCommandId) {
            // going completely out of conditionBlock
            const currentlyOpenConditionBlock = getCurrentlyOpenConditionBlock({
              plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
            });

            if (!currentlyOpenConditionBlock) {
              console.log("There are probably no condition block with assigned TopologyBlock");
              return;
            }

            if (deepLevelCommandCondition > 0) {
              const newFocusedCommandConditionArray = (focusedCommandCondition || []).slice(0, -1);

              sessionStorage.setItem("focusedCommandCondition", `${newFocusedCommandConditionArray?.join("?")}?`);
            } else {
              sessionStorage.setItem("focusedCommandCondition", `none`);
            }

            if (typeof deepLevelConditionBlocks === "number" && deepLevelConditionBlocks > 0) {
              const newFocusedConditionBlockArray = (focusedConditionBlocks || []).slice(0, -1);

              sessionStorage.setItem("focusedConditionBlock", `${newFocusedConditionBlockArray?.join("?")}?`);
            } else {
              sessionStorage.setItem("focusedConditionBlock", `none`);
            }

            const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

            const deepLevel = focusedCommandIf?.includes("none")
              ? null
              : (focusedCommandIf?.length || 0) > 0
              ? (focusedCommandIf?.length || 0) - 1
              : null;

            updateCurrentlyOpenConditionBlock({
              conditionBlockId: "",
              plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
            });

            // if this condition command is inside if command
            if (typeof deepLevel === "number") {
              const currentCommandIf = (focusedCommandIf || [])[deepLevel].split("-");
              const currentCommandIfId = currentCommandIf[3];
              const currentCommandCondition = getCommandIfByPlotfieldCommandId({
                commandIfId: currentCommandIfId,
                isElse: currentFocusedCommandIsElse === "else",
                plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
              });

              sessionStorage.setItem("focusedTopologyBlock", currentCommandCondition?.topologyBlockId || "");
            } else {
              // if this condition command is not inside if command
              const currentCommandCondition = getCommandOnlyByPlotfieldCommandId({
                plotfieldCommandId: currentFocusedCommandConditionPlotfieldId,
              });

              sessionStorage.setItem("focusedTopologyBlock", currentCommandCondition?.topologyBlockId || "");
            }

            const focusedCommandInsideType = sessionStorage
              .getItem("focusedCommandInsideType")
              ?.split("?")
              .filter(Boolean);

            const newFocusedCommandInsideType = focusedCommandInsideType?.slice(0, -1);

            sessionStorage.setItem("focusedCommandInsideType", `${newFocusedCommandInsideType?.join("?")}?`);

            setIsFocusedBackground(false);
            setShowConditionBlockPlot(false);
            return;
          } else {
            // going to the top level of conditionBlock

            const isElse = (currentFocusedCommandCondition || [])[0];
            sessionStorage.setItem(
              "focusedCommand",
              `condition-${currentFocusedCommandConditionPlotfieldId}${isElse === "else" ? "-else" : "-if"}`
            );
            setIsFocusedBackground(true);
            return;
          }
        } else {
          console.log("You are not inside conditionBlock");
          setIsFocusedBackground(false);
          return;
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key.toLowerCase());
    };

    window.addEventListener("keydown", handleGoingDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleGoingDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    conditionId,
    plotfieldCommandId,
    getCurrentlyOpenConditionBlock,
    getFirstCommandByTopologyBlockId,
    updateCurrentlyOpenConditionBlock,
    getFirstConditionBlockWithTopologyBlockId,
    getCommandIfByPlotfieldCommandId,
    getCommandOnlyByPlotfieldCommandId,
  ]);
}

// I want to check the depth of my focusedCommandCondition if it's null then throw some message
// If it has some length I want to see if I'm on the first stage or second,
// basically if focusedCommand's plotfieldCommandId === plotfieldCommandId of my focusedCommandCondition[1], then it means I'm on the first stage
// and I want to slice 0, -1 of focusedCommandCondition, then I want to change currentlyOpenConditionBlock, I want to update focusedTopologyBlock of the value of conditionCommand
// and while I'm doing that I need to check if I'm inside focusedCommandIf, if so then I need to get that command from plotfieldCommandIfSlice.

// If I'm on the stage 2, only thing I want to do is just to update focusedCommand to the plotfieldCommandId of my current condition plotfieldCommandId
