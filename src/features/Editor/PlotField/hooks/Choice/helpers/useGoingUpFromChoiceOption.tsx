import { useEffect } from "react";
import useChoiceOptions from "../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";

type GoingUpFromChoiceOptionsTypes = {
  plotfieldCommandId: string;
  choiceId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChoiceOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useGoingUpFromChoiceOptions({
  setShowChoiceOptionPlot,
  setIsFocusedBackground,
  plotfieldCommandId,
  choiceId,
}: GoingUpFromChoiceOptionsTypes) {
  const { getFirstChoiceOptionWithTopologyBlockId, getCurrentlyOpenChoiceOption, updateCurrentlyOpenChoiceOption } =
    useChoiceOptions();

  const { getFirstCommandByTopologyBlockId, getCommandIfByPlotfieldCommandId, getCommandOnlyByPlotfieldCommandId } =
    usePlotfieldCommands();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleGoingDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if (key === "arrowup" && pressedKeys.has("control")) {
        const currentFocusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        const currentFocusedCommandIsElse = (currentFocusedCommand || [])[2];
        const currentFocusedCommandPlotfieldCommandId = (currentFocusedCommand || [])[1];
        const focusedCommandChoice = sessionStorage.getItem("focusedCommandChoice")?.split("?").filter(Boolean);

        const focusedChoiceOptions = sessionStorage.getItem("focusedChoiceOption")?.split("?").filter(Boolean);

        const deepLevelCommandChoice = focusedCommandChoice?.includes("none")
          ? null
          : (focusedCommandChoice?.length || 0) > 0
          ? (focusedCommandChoice?.length || 0) - 1
          : null;

        const deepLevelChoiceOptions = focusedChoiceOptions?.includes("none")
          ? null
          : (focusedChoiceOptions?.length || 0) > 0
          ? (focusedChoiceOptions?.length || 0) - 1
          : null;

        if (typeof deepLevelCommandChoice === "number") {
          const currentFocusedCommandChoice = (focusedCommandChoice || [])[deepLevelCommandChoice]?.split("-");
          const currentFocusedCommandChoicePlotfieldCommandId = currentFocusedCommandChoice[0];

          if (currentFocusedCommandChoicePlotfieldCommandId !== plotfieldCommandId) {
            // filtering commands, so other choice commands would be stop here
            console.log("Not for you");
            return;
          }

          event.stopPropagation();

          if (currentFocusedCommandPlotfieldCommandId === currentFocusedCommandChoicePlotfieldCommandId) {
            // going completely out of choiceOption
            const currentlyOpenChoiceOption = getCurrentlyOpenChoiceOption({
              choiceId,
            });

            if (!currentlyOpenChoiceOption) {
              console.log("There are probably no choice block with assigned TopologyBlock");
              return;
            }

            if (deepLevelCommandChoice > 0) {
              const newFocusedCommandChoiceArray = (focusedCommandChoice || []).slice(0, -1);

              sessionStorage.setItem("focusedCommandChoice", `${newFocusedCommandChoiceArray?.join("?")}?`);
            } else {
              sessionStorage.setItem("focusedCommandChoice", `none`);
            }

            if (typeof deepLevelChoiceOptions === "number" && deepLevelChoiceOptions > 0) {
              const newFocusedChoiceOptionArray = (focusedChoiceOptions || []).slice(0, -1);

              sessionStorage.setItem("focusedChoiceOption", `${newFocusedChoiceOptionArray?.join("?")}?`);
            } else {
              sessionStorage.setItem("focusedChoiceOption", `none`);
            }

            const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

            const deepLevel = focusedCommandIf?.includes("none")
              ? null
              : (focusedCommandIf?.length || 0) > 0
              ? (focusedCommandIf?.length || 0) - 1
              : null;

            updateCurrentlyOpenChoiceOption({
              choiceOptionId: "",
              plotfieldCommandId: currentFocusedCommandPlotfieldCommandId,
            });

            // if this choice command is inside if command
            if (typeof deepLevel === "number") {
              const currentCommandIf = (focusedCommandIf || [])[deepLevel].split("-");
              const currentCommandIfId = currentCommandIf[3];
              const currentCommandChoice = getCommandIfByPlotfieldCommandId({
                commandIfId: currentCommandIfId,
                isElse: currentFocusedCommandIsElse === "else",
                plotfieldCommandId: currentFocusedCommandPlotfieldCommandId,
              });

              sessionStorage.setItem("focusedTopologyBlock", currentCommandChoice?.topologyBlockId || "");
            } else {
              // if this choice command is not inside if command
              const currentCommandChoice = getCommandOnlyByPlotfieldCommandId({
                plotfieldCommandId: currentFocusedCommandPlotfieldCommandId,
              });

              sessionStorage.setItem("focusedTopologyBlock", currentCommandChoice?.topologyBlockId || "");
            }

            const focusedCommandInsideType = sessionStorage
              .getItem("focusedCommandInsideType")
              ?.split("?")
              .filter(Boolean);

            const newFocusedCommandInsideType = focusedCommandInsideType?.slice(0, -1);

            sessionStorage.setItem("focusedCommandInsideType", `${newFocusedCommandInsideType?.join("?")}?`);

            setIsFocusedBackground(false);
            setShowChoiceOptionPlot(false);
            return;
          } else {
            // going to the top level of choiceOption

            sessionStorage.setItem("focusedCommand", `choice-${currentFocusedCommandChoicePlotfieldCommandId}`);
            event.stopImmediatePropagation();
            setIsFocusedBackground(true);
            return;
          }
        } else {
          console.log("You are not inside choiceOption");
          setIsFocusedBackground(false);
          return;
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
    };

    window.addEventListener("keydown", handleGoingDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleGoingDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    choiceId,
    plotfieldCommandId,
    getCurrentlyOpenChoiceOption,
    getFirstCommandByTopologyBlockId,
    updateCurrentlyOpenChoiceOption,
    getFirstChoiceOptionWithTopologyBlockId,
    getCommandIfByPlotfieldCommandId,
    getCommandOnlyByPlotfieldCommandId,
  ]);
}

// I want to check the depth of my focusedCommandChoice if it's null then throw some message
// If it has some length I want to see if I'm on the first stage or second,
// basically if focusedCommand's plotfieldCommandId === plotfieldCommandId of my focusedCommandChoice[1], then it means I'm on the first stage
// and I want to slice 0, -1 of focusedCommandChoice, then I want to change currentlyOpenChoiceOption, I want to update focusedTopologyBlock of the value of choiceCommand
// and while I'm doing that I need to check if I'm inside focusedCommandIf, if so then I need to get that command from plotfieldCommandIfSlice.

// If I'm on the stage 2, only thing I want to do is just to update focusedCommand to the plotfieldCommandId of my current choice plotfieldCommandId
