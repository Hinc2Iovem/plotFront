import { useEffect } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

type CheckKeysCombinationExpandTypes = {
  setCommand: React.Dispatch<React.SetStateAction<PossibleCommandsCreatedByCombinationOfKeysTypes>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<React.SetStateAction<boolean | null>>;
  setExpansionDivDirection: React.Dispatch<React.SetStateAction<"right" | "left">>;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
};

export default function useCheckKeysCombinationExpandPlotField({
  setCommand,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
  command,
}: CheckKeysCombinationExpandTypes) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key?.toLowerCase() === "v" || event.key?.toLowerCase() === "м") && event.altKey) {
        if (command === "expandPlotField") {
          setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
          setExpansionDivDirection("" as "left" | "right");
          setHideFlowchartFromScriptwriter(false);
        } else {
          setCommand("expandPlotField");
          setExpansionDivDirection("right");
          setHideFlowchartFromScriptwriter(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [command]);

  return command;
}
