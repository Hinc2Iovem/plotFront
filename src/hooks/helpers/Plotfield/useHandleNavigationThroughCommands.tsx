import { useEffect } from "react";
import usePlotfieldCommands from "../../../features/Editor/PlotField/Context/PlotFieldContext";
import useChoiceOptions from "../../../features/Editor/PlotField/PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import useConditionBlocks from "../../../features/Editor/PlotField/PlotFieldMain/Commands/Condition/Context/ConditionContext";
import { CommandSayVariationTypes } from "../../../types/StoryEditor/PlotField/Say/SayTypes";
import {
  handleGoingDownToTheFirstCommand,
  handleNavigationToNextAndPrevCommand,
  navigateBackAndForthInsideConditionCommand,
  navigateBackAndForthInsideIfCommand,
} from "./navigationHelpers/ChecksForUpAndDown";
import { preventMovingInsideIfElseCommands } from "./navigationHelpers/preventMovingInsideIfElseCommands";

export default function useHandleNavigationThroughCommands() {
  const {
    getCommandsByTopologyBlockId,
    getPreviousCommandByPlotfieldId,
    getNextCommandByPlotfieldId,
    updateFocuseReset,
    updateFocuseIfReset,
    getCommandByPlotfieldCommandId,
    getFirstCommandInsideIf,
    getCommandOnlyByPlotfieldCommandId,
    getPreviousCommandIfByPlotfieldId,
    getNextCommandIfByPlotfieldId,
    getCommandIfByPlotfieldCommandId,
  } = usePlotfieldCommands();

  const {
    getFirstConditionBlockWithTopologyBlockId,
    updateCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlock,
  } = useConditionBlocks();

  const { getFirstChoiceOptionWithTopologyBlockId, updateCurrentlyOpenChoiceOption } = useChoiceOptions();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if ((key === "arrowup" || key === "arrowdown") && !pressedKeys.has("control") && !pressedKeys.has("shift")) {
        event.preventDefault();

        const currentTopologyBlock = sessionStorage.getItem("focusedTopologyBlock");
        const currentCommand = sessionStorage.getItem("focusedCommand");
        const currentCommandName = currentCommand?.split("-")[0];
        const currentCommandId = currentCommand?.split("-")[1];

        // Going Down To The First Command Fro The Start
        if (!currentCommand || currentTopologyBlock === currentCommandId) {
          if (key === "arrowup") {
            console.log("IT'S THE FIRST COMMAND DUDE");
            return;
          }

          const nextCommand = getCommandsByTopologyBlockId({
            topologyBlockId: currentTopologyBlock || "",
          })[0];

          handleGoingDownToTheFirstCommand({
            _id: nextCommand._id,
            command: nextCommand.command,
            sayType: nextCommand.sayType || ("" as CommandSayVariationTypes),
          });

          updateFocuseReset({ value: false });
        } else {
          const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

          const focusedCommandCondition = sessionStorage.getItem("focusedCommandCondition")?.split("?").filter(Boolean);

          const deepLevelCommandIf = focusedCommandIf?.includes("none")
            ? null
            : (focusedCommandIf?.length || 0) > 0
            ? (focusedCommandIf?.length || 0) - 1
            : null;

          const deepLevelCommandCondition = focusedCommandCondition?.includes("none")
            ? null
            : (focusedCommandCondition?.length || 0) > 0
            ? (focusedCommandCondition?.length || 0) - 1
            : null;

          const currentNestedCommandIf =
            typeof deepLevelCommandIf === "number" ? (focusedCommandIf || [])[deepLevelCommandIf]?.split("-") : null;
          const currentNestedCommandIfPlotfieldCommnadId = currentNestedCommandIf ? currentNestedCommandIf[1] : null;
          const currentNestedCommandCondition =
            typeof deepLevelCommandCondition === "number"
              ? (focusedCommandCondition || [])[deepLevelCommandCondition]?.split("-")
              : null;
          const currentNestedCommandConditionPlotfieldCommnadId = currentNestedCommandCondition
            ? currentNestedCommandCondition[1]
            : null;

          // When focused on the if command(inside), preventing moving from if to else and vice versa
          if (currentCommandName === "if" && currentNestedCommandIfPlotfieldCommnadId === currentCommandId) {
            preventMovingInsideIfElseCommands({
              currentCommandId,
              deepLevelCommandIf,
              focusedCommandIf,
            });
            return;
          }
          //  else if (
          //   currentCommandName === "condition" &&
          //   currentNestedCommandConditionPlotfieldCommnadId === currentCommandId
          // ) {
          //   preventMovingInsideIfElseCommands({
          //     currentCommandId,
          //     deepLevelCommandIf: deepLevelCommandCondition,
          //     focusedCommandIf: focusedCommandCondition,
          //   });
          //   return;
          // }

          const isCommandIf = currentCommand?.split("-")[2];

          // Navigation back and forth
          if (
            (currentCommandName === "if" && isCommandIf === "if" && key === "arrowdown") ||
            (currentCommandName === "if" && isCommandIf === "else" && key === "arrowup")
          ) {
            navigateBackAndForthInsideIfCommand({
              currentCommandId,
              currentCommandName,
              isCommandIf,
              key,
            });

            return;
          }

          if (
            currentCommandId !== currentNestedCommandConditionPlotfieldCommnadId &&
            ((currentCommandName === "condition" && isCommandIf === "if" && key === "arrowdown") ||
              (currentCommandName === "condition" && isCommandIf === "else" && key === "arrowup"))
          ) {
            navigateBackAndForthInsideConditionCommand({
              currentCommandId,
              currentCommandName,
              isCommandIf,
              key,
            });

            return;
          }

          let newCommand;

          if (typeof deepLevelCommandIf === "number") {
            const currentFocusedCommandIf = (focusedCommandIf || [])[deepLevelCommandIf]?.split("-");

            const isInsideIfCommandIf = currentFocusedCommandIf[0];

            if (isInsideIfCommandIf === "if") {
              newCommand =
                key === "arrowup"
                  ? getPreviousCommandIfByPlotfieldId({
                      plotfieldCommandId: currentCommandId || "",
                      commandIfId: (currentFocusedCommandIf || [])[3] || "",
                      isElse: false,
                    })
                  : getNextCommandIfByPlotfieldId({
                      plotfieldCommandId: currentCommandId || "",
                      commandIfId: (currentFocusedCommandIf || [])[3] || "",
                      isElse: false,
                    });
            } else {
              newCommand =
                key === "arrowup"
                  ? getPreviousCommandIfByPlotfieldId({
                      plotfieldCommandId: currentCommandId || "",
                      commandIfId: (currentFocusedCommandIf || [])[3] || "",
                      isElse: true,
                    })
                  : getNextCommandIfByPlotfieldId({
                      plotfieldCommandId: currentCommandId || "",
                      commandIfId: (currentFocusedCommandIf || [])[3] || "",
                      isElse: true,
                    });
            }
          } else {
            newCommand =
              key === "arrowup"
                ? getPreviousCommandByPlotfieldId({
                    plotfieldCommandId: currentCommandId || "",
                    topologyBlockId: currentTopologyBlock || "",
                  })
                : getNextCommandByPlotfieldId({
                    plotfieldCommandId: currentCommandId || "",
                    topologyBlockId: currentTopologyBlock || "",
                  });
          }

          if (newCommand) {
            handleNavigationToNextAndPrevCommand({
              _id: newCommand._id,
              command: newCommand.command,
              key,
              sayType: newCommand.sayType || ("" as CommandSayVariationTypes),
              commandIfId: newCommand?.commandIfId || "",
              topologyBlockId: newCommand.topologyBlockId,
              topologyBlockIdFromPrevCommand: currentTopologyBlock || "",
            });
            updateFocuseReset({ value: false });
          } else {
            console.log("I wonder why it goes here");
            console.log("No such command was found");
            return;
          }
        }
      }
      // else if (
      //   // this if statement maybe will be removed lately
      //   ((key === "arrowup" || key === "arrowdown") &&
      //     pressedKeys.has("control")) ||
      //   pressedKeys.has("shift")
      // ) {
      //   if (
      //     (pressedKeys.has("shift") && key === "arrowdown") ||
      //     (pressedKeys.has("control") && key === "arrowup")
      //   ) {
      //     event.preventDefault();
      //   }

      //   const isGoingDown = key === "arrowdown" && pressedKeys.has("shift");
      //   const isGoingUp = key === "arrowup" && pressedKeys.has("control");

      //   const currentFocusedCommand = sessionStorage
      //     .getItem("focusedCommand")
      //     ?.split("-");
      //   if (
      //     isGoingDown &&
      //     ((currentFocusedCommand || [])[0] !== "if" ||
      //       (currentFocusedCommand || [])[0] !== "choice" ||
      //       (currentFocusedCommand || [])[0] !== "condition")
      //   ) {
      //     console.log(
      //       "Going down is only possible inside commands such as choice, condition or if"
      //     );
      //     return;
      //   }

      //   const plotfieldCommandCondition = sessionStorage
      //     .getItem("focusedCommandCondition")
      //     ?.split("-");
      //   const plotfieldCommandChoice = sessionStorage
      //     .getItem("focusedCommandChoice")
      //     ?.split("-");

      //   // if (typeof deepLevelCommandIf !== "number" && isGoingDown) {
      //   //   console.log(
      //   //     "You can go one level down only inside if, condition or choice"
      //   //   );
      //   //   return;
      //   // }
      //   if (
      //     plotfieldCommandCondition &&
      //     (plotfieldCommandCondition || [])[0] !== "none"
      //   ) {
      //     const plotfieldCommandId = plotfieldCommandCondition[1];
      //     const insideIf = plotfieldCommandCondition[0] === "if";

      //     GoingDownInsideCondition({
      //       insideIf,
      //       getFirstConditionBlockWithTopologyBlockId,
      //       isGoingDown,
      //       plotfieldCommandId,
      //       updateCurrentlyOpenConditionBlock,
      //     });

      //     GoingUpFromCondition({
      //       getCommandOnlyByPlotfieldCommandId,
      //       getCurrentlyOpenConditionBlock,
      //       isGoingUp,
      //       plotfieldCommandId,
      //       updateCurrentlyOpenConditionBlock,
      //     });
      //     updateFocuseReset({ value: false });
      //   } else if (
      //     plotfieldCommandChoice &&
      //     (plotfieldCommandChoice || [])[0] !== "none"
      //   ) {
      //     const plotfieldCommandId = plotfieldCommandChoice[0];

      //     GoingDownInsideChoice({
      //       getFirstChoiceOptionWithTopologyBlockId,
      //       isGoingDown,
      //       plotfieldCommandId,
      //       updateCurrentlyOpenChoiceOption,
      //     });
      //     GoingUpFromChoice({
      //       getCommandOnlyByPlotfieldCommandId,
      //       getFirstChoiceOptionWithTopologyBlockId,
      //       isGoingUp,
      //       plotfieldCommandId,
      //       updateCurrentlyOpenChoiceOption,
      //     });

      //     updateFocuseReset({ value: false });
      //   } else {
      //     if (isGoingUp) {
      //       const focusedCommand = sessionStorage.getItem("focusedCommand");
      //       const currentCommandId = focusedCommand?.split("-")[1];
      //       if (!currentCommandId) {
      //         console.log("You are already focused on topology block");
      //         return;
      //       }
      //       const focusedTopologyBlock = sessionStorage.getItem(
      //         "focusedTopologyBlock"
      //       );
      //       sessionStorage.setItem(
      //         "focusedCommand",
      //         `none-${focusedTopologyBlock}`
      //       );

      //       sessionStorage.setItem("focusedCommandIf", "none");
      //       sessionStorage.setItem("focusedCommandChoice", "none");
      //       sessionStorage.setItem("focusedCommandCondition", "none");

      //       updateFocuseReset({ value: false });
      //     }
      //   }
      // }
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
    getCommandsByTopologyBlockId,
    getPreviousCommandByPlotfieldId,
    getNextCommandByPlotfieldId,
    updateFocuseReset,
    getFirstCommandInsideIf,
    getCommandByPlotfieldCommandId,
    getFirstConditionBlockWithTopologyBlockId,
    getCurrentlyOpenConditionBlock,
    updateCurrentlyOpenConditionBlock,
    getCommandOnlyByPlotfieldCommandId,
    getFirstChoiceOptionWithTopologyBlockId,
    updateCurrentlyOpenChoiceOption,
    getNextCommandIfByPlotfieldId,
    getPreviousCommandIfByPlotfieldId,
    getCommandIfByPlotfieldCommandId,
    updateFocuseIfReset,
  ]);
}
