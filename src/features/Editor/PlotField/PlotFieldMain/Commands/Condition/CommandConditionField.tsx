import { useEffect, useState } from "react";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useGetCommandCondition from "../../../hooks/Condition/useGetCommandCondition";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import ConditionBlocksList from "./ConditionBlocksList";
import CreateConditionValueTypeModal from "./CreateConditionValueTypeModal";
import usePopulateStateWithConditionBlocks from "./hooks/usePopulateStateWithConditionBlocks";
import { Button } from "@/components/ui/button";

type CommandConditionFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandConditionField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandConditionFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Condition");

  const [isFocusedBackground, setIsFocusedBackground] = useState(false);
  const [showConditionBlockPlot, setShowConditionBlockPlot] = useState(false);

  // useCheckIfShowingPlotfieldInsideConditionOnMount({
  //   plotFieldCommandId,
  //   setIsFocusedBackground,
  //   setShowConditionBlockPlot,
  // });

  const currentlyFocusedCommand = useGetCurrentFocusedElement();
  const isCommandFocused = currentlyFocusedCommand._id === plotFieldCommandId;

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
      <div className="min-w-[100px] flex-grow w-full relative flex items-start gap-[10px]">
        <PlotfieldCommandNameField
          className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"} text-[30px] text-center`}
        >
          {nameValue}
        </PlotfieldCommandNameField>

        {showConditionBlockPlot ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setShowConditionBlockPlot(false);
              setIsFocusedBackground(false);
            }}
            className="w-fit text-text border-border border-[1px] hover:bg-accent hover:shadow-accent active:scale-[.99] bg-secondary rounded-md shadow-sm absolute right-[5px] top-1/2 -translate-y-1/2 hover:shadow-md transition-shadow"
          >
            Назад
          </Button>
        ) : (
          <CreateConditionValueTypeModal
            commandConditionId={commandConditionId}
            plotfieldCommandId={plotFieldCommandId}
          />
        )}
      </div>

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
