import { useEffect, useRef, useState } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import useUpdateSessionStorageGoingDownForIfCommand from "../../../hooks/If/helpers/useUpdateSessionStorageGoingDownForIfCommand";
import useUpdateSessionStorageGoingUpForIfCommand from "../../../hooks/If/helpers/useUpdateSessionStorageGoingUpForIfCommand";
import useGetCommandIf from "../../../hooks/If/useGetCommandIf";
import CommandIfNameField from "./CommandIfNameField";
import useIfVariations from "./Context/IfContext";
import IfVariationsField from "./Variations/IfVariationsField";

type CommandIfFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandIfField({ plotFieldCommandId, topologyBlockId }: CommandIfFieldTypes) {
  const [hideIfCommands, setHideIfCommands] = useState(false);
  const { data: commandIf } = useGetCommandIf({
    plotFieldCommandId,
  });

  const [isFocusedIf, setIsFocusedIf] = useState(true);
  const [isBackgroundFocused, setIsBackgroundFocused] = useState(false);
  const onlyFirstRerender = useRef(true);

  useEffect(() => {
    if (onlyFirstRerender.current) {
      const focusedCommand = sessionStorage.getItem("focusedCommand")?.split("-");
      const focusedCommandIf = sessionStorage.getItem("focusedCommandIf")?.split("?").filter(Boolean);

      const deepLevelCommandIf = focusedCommandIf?.includes("none")
        ? null
        : (focusedCommandIf?.length || 0) > 0
        ? (focusedCommandIf?.length || 0) - 1
        : null;
      if (typeof deepLevelCommandIf === "number") {
        const currentIfCommand = (focusedCommandIf || [])[deepLevelCommandIf].split("-");
        const currentPlotfieldCommandId = currentIfCommand[1];

        if ((focusedCommand || [])[1] === plotFieldCommandId && currentPlotfieldCommandId === plotFieldCommandId) {
          setIsBackgroundFocused(true);
        }
      }
    }

    return () => {
      onlyFirstRerender.current = false;
    };
  }, [plotFieldCommandId]);

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
    setIsFocusedIf,
  });

  const [commandIfId, setCommandIfId] = useState("");
  const { setCommandIf, getAllLogicalOperators } = useIfVariations();

  useEffect(() => {
    if (commandIf) {
      setCommandIf({
        ifVariations: [],
        logicalOperators: commandIf.logicalOperator || "",
        plotfieldCommandId: plotFieldCommandId,
      });
      setCommandIfId(commandIf._id);
    }
  }, [commandIf]);

  useUpdateSessionStorageGoingDownForIfCommand({
    plotfieldCommandIfId: commandIfId,
    plotfieldCommandId: plotFieldCommandId,
    setIsBackgroundFocused,
  });

  useUpdateSessionStorageGoingUpForIfCommand({
    plotfieldCommandId: plotFieldCommandId,
    setIsBackgroundFocused,
    plotfieldCommandIfId: commandIfId,
  });

  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col">
      <CommandIfNameField
        plotfieldCommandId={plotFieldCommandId}
        createInsideElse={false}
        commandIfId={commandIfId}
        hideCommands={hideIfCommands}
        isBackgroundFocused={!isBackgroundFocused}
        isCommandFocused={isCommandFocused}
        isFocusedIf={isFocusedIf}
        nameValue="if"
        setHideCommands={setHideIfCommands}
        topologyBlockId={topologyBlockId}
      />

      <IfVariationsField
        ifId={commandIfId}
        plotfieldCommandId={plotFieldCommandId}
        logicalOperators={getAllLogicalOperators({ plotfieldCommandId: plotFieldCommandId })}
        topologyBlockId={topologyBlockId}
      />
    </div>
  );
}
