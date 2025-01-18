import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import command from "../../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../../assets/images/shared/add.png";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useCreateBlankCommand from "../../../../../hooks/useCreateBlankCommand";
import PlotFieldMain from "../../../../PlotFieldMain";
import useChoiceOptions from "../../Context/ChoiceContext";
import ChoiceOptionInputField from "./ChoiceOptionInputField";
import OptionVariationButton from "./OptionVariationButton";

type PlotfieldInsideChoiceOptionTypes = {
  showOptionPlot: boolean;
  choiceId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  currentTopologyBlockId: string;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldInsideChoiceOption({
  showOptionPlot,
  choiceId,
  plotfieldCommandId,
  isFocusedBackground,
  currentTopologyBlockId,
  setShowOptionPlot,
  setIsFocusedBackground,
}: PlotfieldInsideChoiceOptionTypes) {
  const { episodeId } = useParams();

  const { getCurrentlyOpenChoiceOption, getAllChoiceOptionsByPlotfieldCommandId, getCurrentlyOpenChoiceOptionPlotId } =
    useChoiceOptions();

  const createCommand = useCreateBlankCommand({
    topologyBlockId: getCurrentlyOpenChoiceOption({ plotfieldCommandId })?.topologyBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId: getCurrentlyOpenChoiceOption({ plotfieldCommandId })?.topologyBlockId || "",
    });
  };

  return (
    <section className={`${showOptionPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[5px] relative`}>
      <form onSubmit={(e) => e.preventDefault()}>
        {getAllChoiceOptionsByPlotfieldCommandId({ plotfieldCommandId }).map((op, i) => (
          <ChoiceOptionInputField
            key={"optionValueInput-" + op.topologyBlockId + "-" + op.optionType + "-" + i}
            plotfieldCommandId={plotfieldCommandId}
            option={op.optionText || ""}
            type={op.optionType}
            choiceOptionId={op.choiceOptionId}
            choiceId={choiceId}
            setIsFocusedBackground={setIsFocusedBackground}
            setShowOptionPlot={setShowOptionPlot}
          />
        ))}
      </form>
      <header className="w-full flex gap-[5px] relative px-[10px] flex-wrap">
        {getAllChoiceOptionsByPlotfieldCommandId({ plotfieldCommandId }).map((op, i) => (
          <OptionVariationButton
            key={op.topologyBlockId + "-" + op.optionType + "-" + i}
            {...op}
            choiceId={choiceId}
            type={op.optionType}
            isFocusedBackground={isFocusedBackground}
            plotfieldCommandId={plotfieldCommandId}
            currentTopologyBlockId={currentTopologyBlockId}
            showedOptionPlotTopologyBlockId={getCurrentlyOpenChoiceOptionPlotId({ plotfieldCommandId })}
            setIsFocusedBackground={setIsFocusedBackground}
            setShowOptionPlot={setShowOptionPlot}
          />
        ))}
      </header>

      <main className="flex flex-col gap-[5px] w-full">
        <div className="flex w-full bg-secondary rounded-md shadow-sm itesm-center px-[10px] py-[5px]">
          <Button
            className="bg-brand-gradient px-[5px] hover:shadow-sm hover:shadow-brand-gradient-left active:scale-[.99] transition-all relative "
            onClick={handleCreateCommand}
          >
            <img
              src={plus}
              alt="+"
              className="w-[15px] absolute translate-y-1/2 translate-x-1/2 right-[0rem] bottom-0"
            />
            <img src={command} alt="Commands" className="w-[30px]" />
          </Button>
        </div>
        <PlotFieldMain
          showAllCommands={false}
          renderedAsSubPlotfield={true}
          topologyBlockId={getCurrentlyOpenChoiceOption({ plotfieldCommandId })?.topologyBlockId || ""}
        />
      </main>
    </section>
  );
}
