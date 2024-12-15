import { useEffect } from "react";
import useConditionBlocks from "../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";

type GoingDownInsideConditionBlocksTypes = {
  plotfieldCommandId: string;
  conditionId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useGoingDownInsideConditionBlocks({
  setShowConditionBlockPlot,
  setIsFocusedBackground,
  plotfieldCommandId,
  conditionId,
}: GoingDownInsideConditionBlocksTypes) {
  const {
    getFirstConditionBlockWithTopologyBlockId,
    updateCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlock,
  } = useConditionBlocks();

  const { getFirstCommandByTopologyBlockId } = usePlotfieldCommands();
  useEffect(() => {
    const pressedKeys = new Set();

    const handleGoingDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (key === "arrowdown" && pressedKeys.has("shift")) {
        const currentFocusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");
        const currentCommandPlotfieldId = (currentFocusedCommand || [])[1];
        const isElse = (currentFocusedCommand || [])[2];
        if (currentCommandPlotfieldId !== plotfieldCommandId) {
          console.log("Not for you");
          return;
        }

        // firstly I need to check the depth of my current sessionStorage focusedCommandCondition, then I need to check if the value === "none", if so assign focusedCommandCondition and return
        // if it's not === to none then I need to check If I already have this value as my last array element, if so it's the second shift + arrownDown, if not it's the first time.

        const focusedCommandCondition = sessionStorage.getItem("focusedCommandCondition")?.split("?").filter(Boolean);

        const newConditionValue = `${
          isElse === "else" ? "else" : "if"
        }-${plotfieldCommandId}-conditionId-${conditionId}`;

        const deepLevelCommandCondition = focusedCommandCondition?.includes("none")
          ? null
          : (focusedCommandCondition?.length || 0) > 0
          ? (focusedCommandCondition?.length || 0) - 1
          : null;

        if (typeof deepLevelCommandCondition === "number") {
          const currentFocusedCommandCondition = (focusedCommandCondition || [])[deepLevelCommandCondition].split("-");

          const currentFocusedCommandConditionPlotfieldId = currentFocusedCommandCondition[1];

          if (currentFocusedCommandConditionPlotfieldId === plotfieldCommandId) {
            // second click
            const currentlyOpenConditionBlock = getCurrentlyOpenConditionBlock({
              plotfieldCommandId,
            });
            if (!currentlyOpenConditionBlock) {
              console.log("You should have an open conditionBlock. How did you do that?");
              return;
            }

            const fisrtCommand = getFirstCommandByTopologyBlockId({
              topologyBlockId: currentlyOpenConditionBlock?.targetBlockId || "",
            });

            if (!fisrtCommand) {
              console.log("Oops, probably you haven't created any command inside condition yet.");
              return;
            }

            setShowConditionBlockPlot(true);

            sessionStorage.setItem(
              "focusedCommand",
              `${fisrtCommand?.sayType?.trim().length ? fisrtCommand.sayType : fisrtCommand?.command}-${
                fisrtCommand?._id
              }`
            );

            event.stopImmediatePropagation();
            setIsFocusedBackground(false);
            return;
          } else {
            // first click
            if (currentFocusedCommandCondition[1] === newConditionValue[1]) {
              console.log(
                "This is a save return, when depth of the condition commnad = 0, in order to not reassign values"
              );
              return;
            }
            const firstConditionBlock = getFirstConditionBlockWithTopologyBlockId({
              insideElse: isElse === "else",
              plotfieldCommandId,
            });

            if (!firstConditionBlock || (isElse === "else" && !firstConditionBlock.isElse)) {
              console.log("There are probably no condition block with assigned TopologyBlock");
              return;
            }

            const focusedCommandInsideType = sessionStorage.getItem("focusedCommandInsideType");

            sessionStorage.setItem(
              "focusedCommandInsideType",
              `${focusedCommandInsideType}${plotfieldCommandId}-condition-${isElse}?`
            );

            sessionStorage.setItem(
              "focusedCommandCondition",
              `${focusedCommandCondition?.join("?")}?${newConditionValue}?`
            );

            const currentConditionBlocksSession = sessionStorage.getItem("focusedConditionBlock");

            sessionStorage.setItem(
              "focusedConditionBlock",
              `${currentConditionBlocksSession}${firstConditionBlock.isElse ? "else" : "if"}-${
                firstConditionBlock.conditionBlockId
              }-plotfieldCommandId-${currentCommandPlotfieldId}?`
            );

            sessionStorage.setItem("focusedTopologyBlock", firstConditionBlock.targetBlockId);

            updateCurrentlyOpenConditionBlock({
              conditionBlockId: firstConditionBlock.conditionBlockId,
              plotfieldCommandId,
            });
            setIsFocusedBackground(true);
            return;
          }
        } else {
          // deepLevel === 0
          const firstConditionBlock = getFirstConditionBlockWithTopologyBlockId({
            insideElse: isElse === "else",
            plotfieldCommandId,
          });

          if (
            !firstConditionBlock ||
            (isElse === "else" && !firstConditionBlock.isElse) ||
            (isElse === "if" && firstConditionBlock.isElse)
          ) {
            console.log("There are probably no condition block with assigned TopologyBlock");
            return;
          }

          const focusedCommandInsideType = sessionStorage.getItem("focusedCommandInsideType");

          sessionStorage.setItem(
            "focusedCommandInsideType",
            `${focusedCommandInsideType}${plotfieldCommandId}-condition-${isElse}?`
          );

          sessionStorage.setItem("focusedCommandCondition", `${newConditionValue}?`);

          sessionStorage.setItem(
            "focusedConditionBlock",
            `${firstConditionBlock.isElse ? "else" : "if"}-${
              firstConditionBlock.conditionBlockId
            }-plotfieldCommandId-${currentCommandPlotfieldId}?`
          );

          sessionStorage.setItem("focusedTopologyBlock", firstConditionBlock.targetBlockId);

          updateCurrentlyOpenConditionBlock({
            conditionBlockId: firstConditionBlock.conditionBlockId,
            plotfieldCommandId,
          });
          setIsFocusedBackground(true);
          return;
        }

        // 1st click I want to update currentlyOpenConditionBlock. I will update it with the first block which has topologyBlockId, and need to account for if/else
        // update focusedCommandCondition, give it a new value with ?
        // update focusedTopologyBlock to the id of the topologyBlock of currentlyOpenConditionBlock

        // 2nd click I want to go on the first command in the currentlyOpenConditionBlock
        // and I want to update focusedCommand to the plotfieldId and name of the first currentlyOpenConditionBlock result
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
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
  ]);
}
