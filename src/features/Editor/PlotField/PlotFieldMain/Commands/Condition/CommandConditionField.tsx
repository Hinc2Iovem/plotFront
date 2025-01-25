import { useEffect, useState } from "react";
import useGetCommandCondition from "../../../hooks/Condition/useGetCommandCondition";
import ConditionBlocksList from "./ConditionBlocksList";
import usePopulateStateWithConditionBlocks from "./hooks/usePopulateStateWithConditionBlocks";
import ConditionPlotfieldCommandNameField from "./ConditionPlotfieldCommandNameField";

type CommandConditionFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandConditionField({ plotFieldCommandId, topologyBlockId }: CommandConditionFieldTypes) {
  const [isFocusedBackground, setIsFocusedBackground] = useState(false);
  const [showConditionBlockPlot, setShowConditionBlockPlot] = useState(false);

  // useCheckIfShowingPlotfieldInsideConditionOnMount({
  //   plotFieldCommandId,
  //   setIsFocusedBackground,
  //   setShowConditionBlockPlot,
  // });

  const [commandConditionId, setCommandConditionId] = useState("");

  const { data: commandCondition } = useGetCommandCondition({
    plotFieldCommandId,
  });

  useEffect(() => {
    if (commandCondition) {
      setCommandConditionId(commandCondition._id);
    }
  }, [commandCondition]);

  usePopulateStateWithConditionBlocks({ commandConditionId, plotFieldCommandId });
  return (
    <div className="flex gap-[10px] w-full rounded-md p-[5px] flex-col relative">
      <ConditionPlotfieldCommandNameField
        commandConditionId={commandConditionId}
        plotFieldCommandId={plotFieldCommandId}
        setIsFocusedBackground={setIsFocusedBackground}
        setShowConditionBlockPlot={setShowConditionBlockPlot}
        showConditionBlockPlot={showConditionBlockPlot}
      />

      <ConditionBlocksList
        commandConditionId={commandConditionId}
        topologyBlockId={topologyBlockId}
        plotFieldCommandId={plotFieldCommandId}
        showConditionBlockPlot={showConditionBlockPlot}
        setShowConditionBlockPlot={setShowConditionBlockPlot}
        isFocusedBackground={isFocusedBackground}
      />
    </div>
  );
}
