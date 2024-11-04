import { useParams } from "react-router-dom";
import command from "../../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../../assets/images/shared/add.png";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useCreateBlankCommand from "../../../../../hooks/useCreateBlankCommand";
import PlotFieldMain from "../../../../PlotFieldMain";
import useChoiceOptions from "../../Context/ChoiceContext";
import { ChoiceOptionTypesAndTopologyBlockIdsTypes } from "../ChoiceOptionBlocksList";
import ChoiceOptionInputField from "./ChoiceOptionInputField";

type PlotfieldInsideChoiceOptionTypes = {
  showOptionPlot: boolean;
  choiceId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldInsideChoiceOption({
  showOptionPlot,
  choiceId,
  plotfieldCommandId,
  isFocusedBackground,
  setShowOptionPlot,
  setIsFocusedBackground,
}: PlotfieldInsideChoiceOptionTypes) {
  const { episodeId } = useParams();

  const {
    getCurrentlyOpenChoiceOption,
    getAllChoiceOptionsByChoiceId,
    getCurrentlyOpenChoiceOptionPlotId,
  } = useChoiceOptions();

  // const [showMessage, setShowMessage] = useState("");

  const createCommand = useCreateBlankCommand({
    topologyBlockId:
      getCurrentlyOpenChoiceOption({ choiceId })?.topologyBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId:
        getCurrentlyOpenChoiceOption({ choiceId })?.topologyBlockId || "",
    });
  };

  return (
    <section
      className={`${
        showOptionPlot || isFocusedBackground ? "" : "hidden"
      } flex flex-col gap-[1rem] relative`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionPlot(false);
          setIsFocusedBackground(false);
        }}
        className="w-[2.5rem] h-[1rem] bg-secondary rounded-md shadow-sm absolute right-[-.3rem] top-[-.3rem] hover:shadow-md transition-shadow"
      ></button>
      <form onSubmit={(e) => e.preventDefault()}>
        {getAllChoiceOptionsByChoiceId({ choiceId }).map((op, i) => (
          <ChoiceOptionInputField
            key={
              "optionValueInput-" +
              op.topologyBlockId +
              "-" +
              op.optionType +
              "-" +
              i
            }
            option={op.optionText || ""}
            topologyBlockId={op.topologyBlockId || ""}
            type={op.optionType}
            choiceOptionId={op.choiceOptionId}
            choiceId={choiceId}
          />
        ))}
      </form>
      <header className="w-full flex gap-[.5rem] relative px-[1rem] py-[.9rem] flex-wrap">
        {getAllChoiceOptionsByChoiceId({ choiceId }).map((op, i) => (
          <OptionVariationButton
            key={op.topologyBlockId + "-" + op.optionType + "-" + i}
            {...op}
            choiceId={choiceId}
            type={op.optionType}
            isFocusedBackground={isFocusedBackground}
            plotfieldCommandId={plotfieldCommandId}
            showedOptionPlotTopologyBlockId={getCurrentlyOpenChoiceOptionPlotId(
              { choiceId }
            )}
          />
        ))}
      </header>

      <main className="flex flex-col gap-[.5rem] w-full">
        <div className="flex w-full bg-secondary rounded-md shadow-sm itesm-center  px-[1rem] py-[.5rem]">
          <div className="flex gap-[1rem]">
            <ButtonHoverPromptModal
              contentName="Все команды"
              positionByAbscissa="left"
              asideClasses="text-text-light text-[1.3rem] top-[3.5rem] bottom-[-3.5rem]"
              className="bg-primary-darker shadow-sm shadow-gray-400 active:scale-[.99]"
              variant="rectangle"
            >
              <img src={command} alt="Commands" className="w-[3rem]" />
            </ButtonHoverPromptModal>
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
        </div>
        <PlotFieldMain
          showAllCommands={false}
          renderedAsSubPlotfield={true}
          topologyBlockId={
            getCurrentlyOpenChoiceOption({ choiceId })?.topologyBlockId || ""
          }
        />
      </main>
    </section>
  );
}

type OptionVariationButtonTypes = {
  showedOptionPlotTopologyBlockId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  choiceId: string;
} & ChoiceOptionTypesAndTopologyBlockIdsTypes;

function OptionVariationButton({
  showedOptionPlotTopologyBlockId,
  type,
  topologyBlockId,
  choiceOptionId,
  plotfieldCommandId,
  isFocusedBackground,
  choiceId,
}: OptionVariationButtonTypes) {
  const {
    updateCurrentlyOpenChoiceOption,
    getCurrentlyOpenChoiceOptionPlotId,
  } = useChoiceOptions();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.currentTarget.blur();
        if (topologyBlockId) {
          updateCurrentlyOpenChoiceOption({
            plotfieldCommandId,
            choiceOptionId,
          });
        } else {
          console.log("Выберите Топологический Блок");
          // setShowOptionPlot(false);
          // setShowedOptionPlotTopologyBlockId("");
          // setAllChoiceOptionTypesAndTopologyBlockIds([]);
        }
      }}
      className={`${
        topologyBlockId === showedOptionPlotTopologyBlockId ||
        getCurrentlyOpenChoiceOptionPlotId({ choiceId }) === choiceOptionId
          ? "bg-primary-darker text-text-light focus-within:outline-secondary"
          : "bg-secondary"
      } ${
        isFocusedBackground &&
        getCurrentlyOpenChoiceOptionPlotId({ choiceId }) === choiceOptionId
          ? "border-dark-blue border-dashed border-[2px]"
          : ""
      } ${
        !topologyBlockId
          ? "hover:outline-red-200 focus-within:outline-red-200"
          : `focus-within:bg-primary-darker focus-within:text-text-dark`
      } text-[1.5rem] outline-none rounded-md px-[1rem] py-[.5rem] shadow-sm transition-all hover:text-text-light text-text-dark hover:bg-primary-darker `}
    >
      {type}
    </button>
  );
}
