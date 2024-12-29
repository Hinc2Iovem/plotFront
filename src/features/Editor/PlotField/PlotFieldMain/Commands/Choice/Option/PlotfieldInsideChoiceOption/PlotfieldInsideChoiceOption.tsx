import { useParams } from "react-router-dom";
import command from "../../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../../assets/images/shared/add.png";
import ButtonHoverPromptModal from "../../../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
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
    <section className={`${showOptionPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[1rem] relative`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionPlot(false);
          setIsFocusedBackground(false);
        }}
        className="w-[2.5rem] h-[1rem] bg-secondary rounded-md shadow-sm absolute right-[-.3rem] top-[-.3rem] hover:shadow-md transition-shadow"
      ></button>
      <form onSubmit={(e) => e.preventDefault()}>
        {getAllChoiceOptionsByPlotfieldCommandId({ plotfieldCommandId }).map((op, i) => (
          <ChoiceOptionInputField
            key={"optionValueInput-" + op.topologyBlockId + "-" + op.optionType + "-" + i}
            plotfieldCommandId={plotfieldCommandId}
            option={op.optionText || ""}
            topologyBlockId={op.topologyBlockId || ""}
            type={op.optionType}
            choiceOptionId={op.choiceOptionId}
            choiceId={choiceId}
          />
        ))}
      </form>
      <header className="w-full flex gap-[.5rem] relative px-[1rem] py-[.9rem] flex-wrap">
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

      <main className="flex flex-col gap-[.5rem] w-full">
        <div className="flex w-full bg-secondary rounded-md shadow-sm itesm-center px-[1rem] py-[.5rem]">
          <ButtonHoverPromptModal
            contentName="Создать строку"
            positionByAbscissa="left"
            className="bg-primary  shadow-sm shadow-gray-400 active:scale-[.99] relative "
            asideClasses="text-text-light text-[1.3rem] top-[3.5rem] bottom-[-3.5rem]"
            onClick={handleCreateCommand}
            variant="rectangle"
          >
            <img
              src={plus}
              alt="+"
              className="w-[1.5rem] absolute translate-y-1/2 translate-x-1/2 right-[0rem] bottom-0"
            />
            <img src={command} alt="Commands" className="w-[3rem]" />
          </ButtonHoverPromptModal>
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
