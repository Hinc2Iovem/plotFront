import { useEffect, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import { preventCreatingCommandsWhenFocus } from "../Plotfield/preventCreatingCommandsWhenFocus";

export default function useCheckKeysCombinationCreateBlankCommand() {
  const [command, setCommand] = useState<PossibleCommandsCreatedByCombinationOfKeysTypes>(
    "" as PossibleCommandsCreatedByCombinationOfKeysTypes
  );

  useEffect(() => {
    if (!preventCreatingCommandsWhenFocus()) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (event.ctrlKey && (key === "m" || key === "ь")) {
        if (command !== "blankPlotFieldCommand") {
          setCommand("blankPlotFieldCommand");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [command]);

  return command;
}
