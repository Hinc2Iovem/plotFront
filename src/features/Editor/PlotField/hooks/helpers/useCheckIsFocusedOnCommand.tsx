import { useEffect } from "react";
import useNavigation from "../../../Context/Navigation/NavigationContext";
import usePlotfieldCommands from "../../Context/PlotFieldContext";

export default function useCheckIsFocusedOnCommand() {
  const { currentlyFocusedCommandId, setCurrentlyFocusedCommandId } = useNavigation();
  const { getCommandOnlyByPlotfieldCommandId } = usePlotfieldCommands();
  useEffect(() => {
    const focusedCommand = sessionStorage.getItem("focusedCommand") || "";
    if (!focusedCommand?.trim().length) {
      return;
    }

    if (!currentlyFocusedCommandId) {
      // PlotfieldCommand in context and on backend needs to handle population of else and end command
      const focusedType = sessionStorage.getItem("");
    }
  }, [currentlyFocusedCommandId]);
}
