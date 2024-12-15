import { useEffect } from "react";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useChoiceOptions from "../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";

type GoingDownInsideChoiceOptionTypes = {
  plotfieldCommandId: string;
  choiceId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChoiceOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useGoingDownInsideChoiceOption({
  plotfieldCommandId,
  choiceId,
  setShowChoiceOptionPlot,
  setIsFocusedBackground,
}: GoingDownInsideChoiceOptionTypes) {
  const { getCurrentlyOpenChoiceOption, updateCurrentlyOpenChoiceOption, getFirstChoiceOptionWithTopologyBlockId } =
    useChoiceOptions();

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

        if (currentCommandPlotfieldId !== plotfieldCommandId) {
          console.log("Not for you");
          return;
        }

        // firstly I need to check the depth of my current sessionStorage focusedCommandChoice, then I need to check if the value === "none", if so assign focusedCommandChoice and return
        // if it's not === to none then I need to check If I already have this value as my last array element, if so it's the second shift + arrownDown, if not it's the first time.

        const focusedCommandChoice = sessionStorage.getItem("focusedCommandChoice")?.split("?").filter(Boolean);

        const newChoiceValue = `${plotfieldCommandId}-choiceId-${choiceId}`;

        const deepLevelCommandChoice = focusedCommandChoice?.includes("none")
          ? null
          : (focusedCommandChoice?.length || 0) > 0
          ? (focusedCommandChoice?.length || 0) - 1
          : null;

        if (typeof deepLevelCommandChoice === "number") {
          const currentFocusedCommandChoice = (focusedCommandChoice || [])[deepLevelCommandChoice].split("-");

          const currentFocusedCommandChoiceId = currentFocusedCommandChoice[2];

          if (currentFocusedCommandChoiceId === choiceId) {
            // second click
            const currentlyOpenChoiceOption = getCurrentlyOpenChoiceOption({
              choiceId: currentFocusedCommandChoiceId,
            });
            if (!currentlyOpenChoiceOption) {
              console.log("You should have an open choiceOption. How did you do that?");
              return;
            }

            const fisrtCommand = getFirstCommandByTopologyBlockId({
              topologyBlockId: currentlyOpenChoiceOption?.topologyBlockId || "",
            });

            if (!fisrtCommand) {
              console.log("Oops, probably you haven't created any command inside choice yet.");
              return;
            }

            setShowChoiceOptionPlot(true);

            sessionStorage.setItem(
              "focusedCommand",
              `${fisrtCommand?.sayType?.trim().length ? fisrtCommand.sayType : fisrtCommand?.command}-${
                fisrtCommand?._id
              }`
            );

            setIsFocusedBackground(false);
            event.stopImmediatePropagation();
            return;
          } else {
            // first click
            if (currentFocusedCommandChoice[2] === newChoiceValue[2]) {
              console.log(
                "This is a save return, when depth of the choice commnad = 0, in order to not reassign values"
              );
              return;
            }
            const firstChoiceOption = getFirstChoiceOptionWithTopologyBlockId({
              plotfieldCommandId,
            });

            if (!firstChoiceOption) {
              console.log("There are probably no choice option with assigned TopologyBlock");
              return;
            }

            sessionStorage.setItem("focusedCommandChoice", `${focusedCommandChoice?.join("?")}?${newChoiceValue}?`);

            const currentChoiceOptionsSession = sessionStorage.getItem("focusedChoiceOption");

            sessionStorage.setItem(
              "focusedChoiceOption",
              `${currentChoiceOptionsSession}${firstChoiceOption.optionType}-${firstChoiceOption.choiceOptionId}-plotfieldCommandId-${currentCommandPlotfieldId}?`
            );

            const focusedCommandInsideType = sessionStorage.getItem("focusedCommandInsideType");

            sessionStorage.setItem(
              "focusedCommandInsideType",
              `${focusedCommandInsideType}${plotfieldCommandId}-choice?`
            );

            sessionStorage.setItem("focusedTopologyBlock", firstChoiceOption.topologyBlockId);

            updateCurrentlyOpenChoiceOption({
              choiceOptionId: firstChoiceOption.choiceOptionId,
              plotfieldCommandId,
            });
            setIsFocusedBackground(true);
            return;
          }
        } else {
          // deepLevel === 0
          const firstChoiceOption = getFirstChoiceOptionWithTopologyBlockId({
            plotfieldCommandId,
          });

          if (!firstChoiceOption) {
            console.log("There are probably no choice option with assigned TopologyBlock");
            return;
          }

          sessionStorage.setItem("focusedCommandChoice", `${newChoiceValue}?`);

          sessionStorage.setItem(
            "focusedChoiceOption",
            `${firstChoiceOption.optionType}-${firstChoiceOption.choiceOptionId}-plotfieldCommandId-${currentCommandPlotfieldId}?`
          );

          const focusedCommandInsideType = sessionStorage.getItem("focusedCommandInsideType");

          sessionStorage.setItem(
            "focusedCommandInsideType",
            `${focusedCommandInsideType}${plotfieldCommandId}-choice?`
          );

          sessionStorage.setItem("focusedTopologyBlock", firstChoiceOption.topologyBlockId);

          updateCurrentlyOpenChoiceOption({
            choiceOptionId: firstChoiceOption.choiceOptionId,
            plotfieldCommandId,
          });
          setIsFocusedBackground(true);
          return;
        }

        // 1st click I want to update currentlyOpenChoiceOption. I will update it with the first option which has topologyBlockId, and need to account for if/else
        // update focusedCommandChoice, give it a new value with ?
        // update focusedTopologyBlock to the id of the topologyBlock of currentlyOpenChoiceOption

        // 2nd click I want to go on the first command in the currentlyOpenChoiceOption
        // and I want to update focusedCommand to the plotfieldId and name of the first currentlyOpenChoiceOption result
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
    choiceId,
    plotfieldCommandId,
    getCurrentlyOpenChoiceOption,
    getFirstCommandByTopologyBlockId,
    updateCurrentlyOpenChoiceOption,
    getFirstChoiceOptionWithTopologyBlockId,
  ]);
}
