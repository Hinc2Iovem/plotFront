import { Button } from "@/components/ui/button";
import useConditionBlocks from "../Context/ConditionContext";

type ConditionBlockShowPlotTypes = {
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
  targetBlockId: string;
  plotfieldCommandId: string;
  conditionBlockId: string;
  isElse: boolean;
};

export default function ConditionBlockShowPlot({
  setShowConditionBlockPlot,
  targetBlockId,
  plotfieldCommandId,
  conditionBlockId,
  isElse,
}: ConditionBlockShowPlotTypes) {
  const { updateCurrentlyOpenConditionBlock } = useConditionBlocks();
  return (
    <div className={`${isElse ? "flex-grow" : ""}`}>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          if (targetBlockId) {
            setShowConditionBlockPlot(true);
            updateCurrentlyOpenConditionBlock({
              conditionBlockId,
              plotfieldCommandId,
            });
          } else {
            console.error("Choose TopologyBlock,firstly");
          }
        }}
        className={`text-text ${
          isElse
            ? "w-full py-[10px] text-[20px] hover:bg-accent transition-all active:scale-[.99]"
            : "bg-accent hover:shadow-sm hover:shadow-accent focus-within:shadow-sm focus-within:shadow-accent active:scale-[.99] transition-all"
        }`}
        type="button"
      >
        Сценарий
      </Button>
    </div>
  );
}
