import { useEffect } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

type CheckKeysCombinationExpandTypes = {
  setCommand: React.Dispatch<
    React.SetStateAction<PossibleCommandsCreatedByCombinationOfKeysTypes>
  >;
  setHideFlowchartFromScriptwriter: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
  setExpansionDivDirection: React.Dispatch<
    React.SetStateAction<"right" | "left">
  >;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
};

export default function useCheckKeysCombinationExpandFlowchart({
  command,
  setCommand,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
}: CheckKeysCombinationExpandTypes) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === "c") {
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

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [command]);

  return command;
}
