import { useEffect, useRef, useState } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../Context/PlotfieldCommandIfSlice";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import useUpdateSessionStorageGoingDownForIfCommand from "../../../hooks/If/helpers/useUpdateSessionStorageGoingDownForIfCommand";
import useUpdateSessionStorageGoingUpForIfCommand from "../../../hooks/If/helpers/useUpdateSessionStorageGoingUpForIfCommand";
import useGetCommandIf from "../../../hooks/If/useGetCommandIf";
import useGetAllPlotFieldCommandsByIfIdInsideElse from "../../../hooks/useGetAllPlotFieldCommandsByIfIdInsideIElse";
import useGetAllPlotFieldCommandsByIfIdInsideIf from "../../../hooks/useGetAllPlotFieldCommandsByIfIdInsideIf";
import CommandIfNameField from "./CommandIfNameField";
import PlotfieldIfItems from "./PlotfieldIfItems";
import IfVariationsField from "./Variations/IfVariationsField";
import useIfVariations from "./Context/IfContext";

type CommandIfFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandIfField({ plotFieldCommandId, topologyBlockId }: CommandIfFieldTypes) {
  const {
    setAllIfCommands,
    setCurrentAmountOfIfCommands,
    updateFocuseReset,
    updateFocuseIfReset,
    getFirstCommandInsideIf,
  } = usePlotfieldCommands();

  const [hideIfCommands, setHideIfCommands] = useState(false);
  const [hideElseCommands, setHideElseCommands] = useState(false);
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
    }
  }, [commandIf]);

  useUpdateSessionStorageGoingDownForIfCommand({
    commandIfId,
    plotfieldCommandId: plotFieldCommandId,
    updateFocuseReset,
    getFirstCommandInsideIf,
    updateFocuseIfReset,
    setIsBackgroundFocused,
  });

  useUpdateSessionStorageGoingUpForIfCommand({
    commandIfId,
    plotfieldCommandId: plotFieldCommandId,
    updateFocuseReset,
    getFirstCommandInsideIf,
    updateFocuseIfReset,
    setIsBackgroundFocused,
  });

  const { data: commandsInsideIf } = useGetAllPlotFieldCommandsByIfIdInsideIf({
    commandIfId,
  });
  const { data: commandsInsideElse } = useGetAllPlotFieldCommandsByIfIdInsideElse({
    commandIfId,
  });

  useEffect(() => {
    if (commandsInsideElse && commandsInsideIf && commandIfId) {
      setAllIfCommands({
        commandIfId,
        commandsInsideElse: commandsInsideElse as PlotfieldOptimisticCommandInsideIfTypes[],
        commandsInsideIf: commandsInsideIf as PlotfieldOptimisticCommandInsideIfTypes[],
      });
    }
  }, [commandsInsideIf, commandsInsideElse, commandIfId]);

  useEffect(() => {
    if (commandIf) {
      setCommandIfId(commandIf._id);

      setCurrentAmountOfIfCommands({
        commandIfId: commandIf._id,
        amountOfCommandsInsideElse: commandIf.amountOfCommandsInsideElse,
        amountOfCommandsInsideIf: commandIf.amountOfCommandsInsideIf,
      });
    }
  }, [commandIf]);

  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col">
      <CommandIfNameField
        plotfieldCommandId={plotFieldCommandId}
        commandIfId={commandIfId}
        createInsideElse={false}
        hideCommands={hideIfCommands}
        isBackgroundFocused={!isBackgroundFocused}
        isCommandFocused={isCommandFocused}
        isFocusedIf={isFocusedIf}
        nameValue="if"
        setHideCommands={setHideIfCommands}
        topologyBlockId={topologyBlockId}
      />

      <IfVariationsField
        plotfieldCommandId={plotFieldCommandId}
        ifId={commandIfId}
        logicalOperators={getAllLogicalOperators({ plotfieldCommandId: plotFieldCommandId })}
        topologyBlockId={topologyBlockId}
      />

      <PlotfieldIfItems
        commandIfId={commandIfId}
        droppableId="commandIf"
        hideCommands={hideIfCommands}
        isBackgroundFocused={isBackgroundFocused}
        isElse={false}
        isFocusedIf={isFocusedIf}
      />

      <CommandIfNameField
        plotfieldCommandId={plotFieldCommandId}
        commandIfId={commandIfId}
        createInsideElse={true}
        hideCommands={hideElseCommands}
        isBackgroundFocused={!isBackgroundFocused}
        isCommandFocused={isCommandFocused}
        isFocusedIf={!isFocusedIf}
        nameValue="else"
        setHideCommands={setHideElseCommands}
        topologyBlockId={topologyBlockId}
      />

      <PlotfieldIfItems
        commandIfId={commandIfId}
        droppableId="commandIfElse"
        hideCommands={hideElseCommands}
        isBackgroundFocused={isBackgroundFocused}
        isElse={true}
        isFocusedIf={!isFocusedIf}
      />
    </div>
  );
}
