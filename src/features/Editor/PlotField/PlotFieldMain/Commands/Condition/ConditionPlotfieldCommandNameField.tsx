import { Button } from "@/components/ui/button";
import PlotfieldCommandNameField from "@/ui/Texts/PlotfieldCommandNameField";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useConditionBlocks from "./Context/ConditionContext";
import CreateConditionValueTypeModal from "./CreateConditionValueTypeModal";
import DeleteCommandContextMenuWrapper from "../../components/DeleteCommandContextMenuWrapper";

type ConditionPlotfieldCommandNameFIeldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConditionPlotfieldCommandNameField({
  plotFieldCommandId,
  commandConditionId,
  topologyBlockId,
  setIsFocusedBackground,
}: ConditionPlotfieldCommandNameFIeldTypes) {
  const currentlyFocusedCommand = useGetCurrentFocusedElement();
  const isCommandFocused = currentlyFocusedCommand._id === plotFieldCommandId;
  const showConditionBlockPlot =
    (useConditionBlocks(
      (state) =>
        state.conditions.find((c) => c.plotfieldCommandId === plotFieldCommandId)?.currentlyOpenConditionBlockPlotId
    )?.trim().length || 0) > 0;
  const updateCurrentlyOpenConditionBlock = useConditionBlocks((state) => state.updateCurrentlyOpenConditionBlock);

  return (
    <DeleteCommandContextMenuWrapper plotfieldCommandId={plotFieldCommandId} topologyBlockId={topologyBlockId}>
      <div className="min-w-[100px] flex-grow w-full relative flex items-start gap-[10px]">
        <PlotfieldCommandNameField
          className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"} text-[30px] text-center`}
        >
          Condition
        </PlotfieldCommandNameField>

        {showConditionBlockPlot ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              updateCurrentlyOpenConditionBlock({
                plotfieldCommandId: plotFieldCommandId,
                conditionBlockId: "",
              });
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
    </DeleteCommandContextMenuWrapper>
  );
}
