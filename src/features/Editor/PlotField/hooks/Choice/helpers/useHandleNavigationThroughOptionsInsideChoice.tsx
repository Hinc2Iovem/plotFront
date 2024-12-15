import { useEffect } from "react";
import useChoiceOptions from "../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";
import { fromFirstToLastOption } from "./functions/NavigationThroughOptions/fromFirstToLastOption";
import { fromLastToFirstOption } from "./functions/NavigationThroughOptions/fromLastToFirstOption";
import { navigateBetweenOptions } from "./functions/NavigationThroughOptions/navigateBetweenOptions";

type HandleNavigationThroughOptionsInsideChoiceTypes = {
  plotfieldCommandId: string;
};

export default function useHandleNavigationThroughOptionsInsideChoice({
  plotfieldCommandId,
}: HandleNavigationThroughOptionsInsideChoiceTypes) {
  const {
    getAmountOfChoiceOptions,
    getIndexOfChoiceOptionById,
    getChoiceOptionByIndex,
    updateCurrentlyOpenChoiceOption,
  } = useChoiceOptions();

  useEffect(() => {
    const pressedKeys = new Set();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (pressedKeys.has(key)) return;
      pressedKeys.add(key);

      if ((key === "arrowdown" && !pressedKeys.has("shift")) || (key === "arrowup" && !pressedKeys.has("control"))) {
        const focusedCommandChoice = sessionStorage.getItem("focusedCommandChoice")?.split("?").filter(Boolean);

        const focusedChoiceOptions = sessionStorage.getItem("focusedChoiceOption")?.split("?").filter(Boolean);

        const focusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");

        const focusedCommandPlotfieldId = (focusedCommand || [])[1];

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
          const currentFocusedCommandChoicePlotfieldId = currentFocusedCommandChoice[0];
          const currentFocusedCommandChoiceId = currentFocusedCommandChoice[2];

          if (currentFocusedCommandChoicePlotfieldId !== plotfieldCommandId) {
            console.log("Not for you");
            return;
          }

          if (focusedCommandPlotfieldId !== currentFocusedCommandChoicePlotfieldId) {
            console.log("It means another function with the same was triggered");
            return;
          }

          if (
            focusedCommandChoice?.includes("none") &&
            focusedCommandPlotfieldId !== currentFocusedCommandChoicePlotfieldId
          ) {
            console.log("You are not at the top level of choice command");
            return;
          }

          if (typeof deepLevelChoiceOptions === "number") {
            const currentFocusedChoiceOption = (focusedChoiceOptions || [])[deepLevelChoiceOptions]?.split("-");

            const currentFocusedChoiceOptionId = currentFocusedChoiceOption[1];

            const indexOfCurrentOption = getIndexOfChoiceOptionById({
              choiceOptionId: currentFocusedChoiceOptionId?.trim(),
              plotfieldCommandId: currentFocusedCommandChoicePlotfieldId?.trim(),
            });

            const currentAmountOfOptions = getAmountOfChoiceOptions({
              choiceId: currentFocusedCommandChoiceId,
            });

            if (
              typeof indexOfCurrentOption !== "number" ||
              indexOfCurrentOption < 0 ||
              indexOfCurrentOption > currentAmountOfOptions
            ) {
              console.log("Extremely bad, you should be here.");
              return;
            }

            if (indexOfCurrentOption === 0 && key === "arrowdown") {
              fromFirstToLastOption({
                currentAmountOfOptions,
                currentFocusedCommandChoicePlotfieldId,
                currentFocusedChoiceOptionId,
                getChoiceOptionByIndex,
                updateCurrentlyOpenChoiceOption,
                deepLevelChoiceOptions,
              });
            } else if (indexOfCurrentOption === currentAmountOfOptions - 1 && key === "arrowup") {
              fromLastToFirstOption({
                currentFocusedCommandChoicePlotfieldId,
                currentFocusedChoiceOptionId,
                getChoiceOptionByIndex,
                updateCurrentlyOpenChoiceOption,
                deepLevelChoiceOptions,
              });
            } else {
              navigateBetweenOptions({
                currentFocusedCommandChoicePlotfieldId,
                currentIndex: indexOfCurrentOption,
                getChoiceOptionByIndex,
                updateCurrentlyOpenChoiceOption,
                deepLevelChoiceOptions,
                isArrowDown: key === "arrowdown",
              });
            }
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.delete(event.key?.toLowerCase());
      pressedKeys.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    plotfieldCommandId,
    getChoiceOptionByIndex,
    getAmountOfChoiceOptions,
    getIndexOfChoiceOptionById,
    updateCurrentlyOpenChoiceOption,
  ]);
}
