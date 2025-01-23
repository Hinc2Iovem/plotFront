import { useEffect } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import { preventCreatingCommandsWhenFocus } from "../Plotfield/preventCreatingCommandsWhenFocus";

type CheckKeysCombinationExpandTypes = {
  setCommand: React.Dispatch<React.SetStateAction<PossibleCommandsCreatedByCombinationOfKeysTypes>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<React.SetStateAction<boolean | null>>;
  setExpansionDivDirection: React.Dispatch<React.SetStateAction<"right" | "left">>;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
};

export default function useCheckKeysCombinationExpandFlowchart({
  command,
  setCommand,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
}: CheckKeysCombinationExpandTypes) {
  useEffect(() => {
    if (!preventCreatingCommandsWhenFocus()) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (event.altKey && (key === "c" || key === "с")) {
        if (command === "expandFlowchart") {
          setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
          setExpansionDivDirection("left");
          setHideFlowchartFromScriptwriter(false);
        } else {
          setCommand("expandFlowchart");
          setExpansionDivDirection("" as "left" | "right");
          setHideFlowchartFromScriptwriter(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [command, setCommand, setHideFlowchartFromScriptwriter, setExpansionDivDirection]);

  return command;
}
