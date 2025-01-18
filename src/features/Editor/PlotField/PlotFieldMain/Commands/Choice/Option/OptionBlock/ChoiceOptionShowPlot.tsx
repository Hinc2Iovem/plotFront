import { Button } from "@/components/ui/button";
import useChoiceOptions from "../../Context/ChoiceContext";

type ChoiceOptionShowPlotTypes = {
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  topologyBlockId: string;
  plotfieldCommandId: string;
  choiceOptionId: string;
};

export default function ChoiceOptionShowPlot({
  setShowOptionPlot,
  topologyBlockId,
  plotfieldCommandId,
  choiceOptionId,
}: ChoiceOptionShowPlotTypes) {
  const { updateCurrentlyOpenChoiceOption } = useChoiceOptions();
  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        if (topologyBlockId) {
          setShowOptionPlot(true);
          updateCurrentlyOpenChoiceOption({
            plotfieldCommandId,
            choiceOptionId,
          });
        } else {
          console.error("Choose TopologyBlock,firstly");
        }
      }}
      className={`text-text self-end bg-accent hover:opacity-80 transition-all active:scale-[.99] focus-within:opacity-80 shadow-md rounded-md px-[10px] py-[5px] whitespace-nowrap`}
      type="button"
    >
      Сценарий
    </Button>
  );
}
