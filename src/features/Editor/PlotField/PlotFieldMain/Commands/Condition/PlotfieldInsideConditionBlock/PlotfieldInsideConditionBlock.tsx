import { useParams } from "react-router-dom";
import command from "../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../assets/images/shared/add.png";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useCreateBlankCommand from "../../../../hooks/useCreateBlankCommand";
import PlotFieldMain from "../../../PlotFieldMain";
import useConditionBlocks, { ConditionBlockItemTypes } from "../Context/ConditionContext";
import ConditionBlockInputField from "./ConditionBlockInputField";

type PlotfieldInsideConditionBlockTypes = {
  showConditionBlockPlot: boolean;
  isFocusedBackground: boolean;
  plotfieldCommandId: string;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldInsideConditionBlock({
  showConditionBlockPlot,
  plotfieldCommandId,
  isFocusedBackground,
  setIsFocusedBackground,
  setShowConditionBlockPlot,
}: PlotfieldInsideConditionBlockTypes) {
  const { episodeId } = useParams();
  const {
    getCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlockPlotId,
    getAllConditionBlocksByPlotfieldCommandId,
    getAllConditionBlocksElseOrIfByPlotfieldCommandId,
  } = useConditionBlocks();

  // const [showMessage, setShowMessage] = useState("");

  const createCommand = useCreateBlankCommand({
    topologyBlockId: getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId: getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId || "",
    });
  };

  const handleUpdatingSessionStorageOnClosing = () => {};

  return (
    <section
      className={`${showConditionBlockPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[1rem] relative`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowConditionBlockPlot(false);
          setIsFocusedBackground(false);
          handleUpdatingSessionStorageOnClosing();
        }}
        className="w-[2.5rem] h-[1rem] bg-secondary rounded-md shadow-sm absolute right-[-.3rem] top-[-.3rem] hover:shadow-md transition-shadow"
      ></button>
      <form onSubmit={(e) => e.preventDefault()}>
        {(
          getAllConditionBlocksElseOrIfByPlotfieldCommandId({
            plotfieldCommandId,
            isElse: false,
          }) as ConditionBlockItemTypes[]
        )?.map((op, i) => (
          <ConditionBlockInputField
            key={"optionValueInput-" + op.targetBlockId + "-" + op.topologyBlockName + "-" + i}
            {...op}
            plotfieldCommandId={plotfieldCommandId}
            insidePlotfield={true}
          />
        ))}
      </form>
      <header className="w-full flex gap-[.5rem] relative flex-wrap">
        {(
          getAllConditionBlocksByPlotfieldCommandId({
            plotfieldCommandId,
          }) as ConditionBlockItemTypes[]
        )?.map((op, i) => (
          <OptionVariationButton
            {...op}
            key={op.targetBlockId + "-" + op.topologyBlockName + "-" + i}
            topologyBlockName={op.topologyBlockName || ""}
            plotfieldCommandId={plotfieldCommandId}
            showedConditionBlockPlotTopologyBlockId={getCurrentlyOpenConditionBlockPlotId({ plotfieldCommandId })}
            isFocusedBackground={isFocusedBackground}
          />
        ))}
      </header>

      <main className="flex flex-col gap-[.5rem] w-full ">
        <div className="flex w-full bg-secondary rounded-md shadow-sm items-center px-[1rem] py-[.5rem]">
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
          topologyBlockId={getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId || ""}
        />
      </main>
    </section>
  );
}

type OptionVariationButtonTypes = {
  showedConditionBlockPlotTopologyBlockId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  topologyBlockName: string;
} & ConditionBlockItemTypes;

function OptionVariationButton({
  showedConditionBlockPlotTopologyBlockId,
  targetBlockId,
  conditionBlockId,
  plotfieldCommandId,
  isElse,
  isFocusedBackground,
  topologyBlockName,
}: OptionVariationButtonTypes) {
  const { updateCurrentlyOpenConditionBlock, getCurrentlyOpenConditionBlockPlotId } = useConditionBlocks();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (targetBlockId) {
          updateCurrentlyOpenConditionBlock({
            plotfieldCommandId,
            conditionBlockId,
          });
        } else {
          console.log("Выберите Топологический Блок");
          // setShowConditionBlockPlot(false);
          // setShowedConditionBlockPlotTopologyBlockId("");
          // setAllConditionBlockTypesAndTopologyBlockIds([]);
        }
      }}
      className={`${
        targetBlockId === showedConditionBlockPlotTopologyBlockId ||
        getCurrentlyOpenConditionBlockPlotId({ plotfieldCommandId }) === conditionBlockId
          ? "bg-primary-darker text-text-light focus-within:outline-secondary"
          : "bg-secondary text-text-dark"
      } ${
        isFocusedBackground && getCurrentlyOpenConditionBlockPlotId({ plotfieldCommandId }) === conditionBlockId
          ? "border-dark-blue border-dashed border-[2px]"
          : ""
      } ${
        !targetBlockId
          ? "hover:outline-red-200 focus-within:outline-red-200"
          : "focus-within:bg-primary-darker focus-within:text-text-dark"
      } min-w-[7rem] text-[1.5rem] outline-none rounded-md px-[1rem] py-[.5rem] shadow-sm transition-all hover:bg-primary-darker hover:text-text-light focus-within:text-text-light`}
    >
      {isElse ? "else" : topologyBlockName}
    </button>
  );
}
