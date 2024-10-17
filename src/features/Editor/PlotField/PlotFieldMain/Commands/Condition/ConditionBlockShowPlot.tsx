import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import useConditionBlocks from "./Context/ConditionContext";

type ConditionBlockShowPlotTypes = {
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
  targetBlockId: string;
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockShowPlot({
  setShowConditionBlockPlot,
  targetBlockId,
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockShowPlotTypes) {
  const { updateCurrentlyOpenConditionBlock } = useConditionBlocks();
  return (
    <div className="relative flex-grow h-fit">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          if (targetBlockId) {
            setShowConditionBlockPlot(true);
            updateCurrentlyOpenConditionBlock({
              targetBlockId,
              conditionBlockId,
              plotfieldCommandId,
            });
          } else {
            console.error("Choose TopologyBlock,firstly");
          }
        }}
        type="button"
      >
        Сценарий
      </PlotfieldButton>
    </div>
  );
}
