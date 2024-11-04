import { useEffect, useState } from "react";
import useGetDecodedJWTValues from "../../Auth/useGetDecodedJWTValues";
import useCheckKeysCombinationExpandPlotField from "../useCheckKeysCombinationExpandPlotField";
import useCheckKeysCombinationExpandFlowchart from "../useCheckKeysCombinationExpandFlowchart";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";

type HandleResizeOfEditorWindowsTypes = {
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  hideFlowchartFromScriptwriter: boolean | null;
  setCommand: React.Dispatch<
    React.SetStateAction<PossibleCommandsCreatedByCombinationOfKeysTypes>
  >;
  setHideFlowchartFromScriptwriter: React.Dispatch<
    React.SetStateAction<boolean | null>
  >;
  setExpansionDivDirection: React.Dispatch<
    React.SetStateAction<"right" | "left">
  >;
};

export default function useHandleResizeOfEditorWindows({
  setCommand,
  setHideFlowchartFromScriptwriter,
  setExpansionDivDirection,
  command,
  hideFlowchartFromScriptwriter,
}: HandleResizeOfEditorWindowsTypes) {
  const { roles } = useGetDecodedJWTValues();
  const [afterFirstRerender, setAfterFirstRerender] = useState(false);

  const keyCombinationToExpandPlotField =
    useCheckKeysCombinationExpandPlotField({
      setCommand,
      setHideFlowchartFromScriptwriter,
      setExpansionDivDirection,
      command,
    });

  useCheckKeysCombinationExpandFlowchart({
    setCommand,
    setHideFlowchartFromScriptwriter,
    setExpansionDivDirection,
    command,
  });

  useEffect(() => {
    // makes only plotfield to show up(for roles below);
    // setAfterFirstRerender - needs to be here for this effect to work only when page loads first time
    if (roles && typeof hideFlowchartFromScriptwriter !== "boolean") {
      if (
        roles.includes("editor") ||
        roles.includes("headscriptwriter") ||
        roles.includes("scriptwriter")
      ) {
        setHideFlowchartFromScriptwriter(true);
        setCommand("expandPlotField");
      } else {
        setHideFlowchartFromScriptwriter(false);
        setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
      }
      setAfterFirstRerender(true);
    }
  }, [roles, keyCombinationToExpandPlotField]);

  useEffect(() => {
    // when clicked on the shrink btn, changes command to show both plotfield and flowchart
    if (
      afterFirstRerender &&
      !hideFlowchartFromScriptwriter &&
      command !== "expandFlowchart"
    ) {
      setCommand("" as PossibleCommandsCreatedByCombinationOfKeysTypes);
    }
  }, [afterFirstRerender, hideFlowchartFromScriptwriter]);

  return keyCombinationToExpandPlotField;
}
