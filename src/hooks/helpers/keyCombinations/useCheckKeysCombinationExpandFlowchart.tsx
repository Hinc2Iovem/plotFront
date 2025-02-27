import { useEffect } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

type CheckKeysCombinationExpandTypes = {
  setCommand: React.Dispatch<React.SetStateAction<PossibleCommandsCreatedByCombinationOfKeysTypes>>;
  setHideFlowchartFromScriptwriter: React.Dispatch<React.SetStateAction<boolean | null>>;
  setExpansionDivDirection: React.Dispatch<React.SetStateAction<"right" | "left">>;
  setShowUtils: React.Dispatch<React.SetStateAction<boolean>>;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
};

export default function useCheckKeysCombinationExpandFlowchart({
  command,
  setCommand,
  setShowUtils,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
}: CheckKeysCombinationExpandTypes) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key?.toLowerCase();
      if (event.altKey && (key === "c" || key === "с")) {
        console.log("lol");
        if (command === "expandFlowchart") {
          setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
          setExpansionDivDirection("left");
          setHideFlowchartFromScriptwriter(false);
        } else {
          setCommand("expandFlowchart");
          setExpansionDivDirection("" as "left" | "right");
          setHideFlowchartFromScriptwriter(false);
        }
        setShowUtils(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [command, setCommand, setHideFlowchartFromScriptwriter, setExpansionDivDirection]);

  return command;
}
