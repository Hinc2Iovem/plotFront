import { useEffect, useState } from "react";
import command from "../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../assets/images/shared/add.png";
import ConditionBlockInputField from "./ConditionBlockInputField";
import useConditionBlocks, {
  ConditionBlockItemTypes,
} from "../Context/ConditionContext";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import PlotFieldMain from "../../../PlotFieldMain";
import useGetTopologyBlockById from "../../hooks/TopologyBlock/useGetTopologyBlockById";
import useCreateBlankCommand from "../../hooks/useCreateBlankCommand";

type PlotfieldInsideConditionBlockTypes = {
  showConditionBlockPlot: boolean;
  plotfieldCommandId: string;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldInsideConditionBlock({
  showConditionBlockPlot,
  plotfieldCommandId,
  setShowConditionBlockPlot,
}: PlotfieldInsideConditionBlockTypes) {
  const {
    getCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlockPlotId,
    getAllConditionBlocksByPlotfieldCommandId,
    getAllConditionBlocksElseOrIfByPlotfieldCommandId,
  } = useConditionBlocks();

  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId:
      getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId ||
      "",
  });
  // const [showMessage, setShowMessage] = useState("");

  const [currentAmountOfCommands, setCurrentAmountOfCommands] =
    useState<number>(0);

  useEffect(() => {
    if (topologyBlock) {
      setCurrentAmountOfCommands(
        topologyBlock.topologyBlockInfo?.amountOfCommands || 0
      );
    }
  }, [topologyBlock]);

  const createCommand = useCreateBlankCommand({
    topologyBlockId:
      getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId ||
      "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      commandOrder: currentAmountOfCommands,
      topologyBlockId:
        getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId ||
        "",
    });
    setCurrentAmountOfCommands((prev) => prev + 1);
    if (createCommand.isError) {
      setCurrentAmountOfCommands((prev) => prev - 1);
    }
  };

  return (
    <section
      className={`${
        showConditionBlockPlot ? "" : "hidden"
      } flex flex-col gap-[1rem] relative`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowConditionBlockPlot(false);
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
            key={
              "optionValueInput-" +
              op.targetBlockId +
              "-" +
              op.conditionType +
              "-" +
              i
            }
            conditionType={op.conditionType}
            conditionBlockId={op.conditionBlockId}
            plotfieldCommandId={plotfieldCommandId}
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
            key={op.targetBlockId + "-" + op.conditionType + "-" + i}
            {...op}
            plotfieldCommandId={plotfieldCommandId}
            showedConditionBlockPlotTopologyBlockId={getCurrentlyOpenConditionBlockPlotId(
              { plotfieldCommandId }
            )}
          />
        ))}
      </header>

      <main className="flex flex-col gap-[.5rem] w-full ">
        <div className="flex w-full bg-secondary rounded-md shadow-sm itesm-center px-[1rem] py-[.5rem]">
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
            getCurrentlyOpenConditionBlock({ plotfieldCommandId })
              ?.targetBlockId || ""
          }
        />
      </main>
    </section>
  );
}

type OptionVariationButtonTypes = {
  showedConditionBlockPlotTopologyBlockId: string;
  plotfieldCommandId: string;
} & ConditionBlockItemTypes;

function OptionVariationButton({
  showedConditionBlockPlotTopologyBlockId,
  conditionType,
  targetBlockId,
  conditionBlockId,
  plotfieldCommandId,
  isElse,
}: OptionVariationButtonTypes) {
  const {
    updateCurrentlyOpenConditionBlock,
    getCurrentlyOpenConditionBlockPlotId,
  } = useConditionBlocks();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (targetBlockId) {
          updateCurrentlyOpenConditionBlock({
            targetBlockId,
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
        getCurrentlyOpenConditionBlockPlotId({ plotfieldCommandId }) ===
          conditionBlockId
          ? "bg-primary-darker text-text-light focus-within:outline-secondary"
          : "bg-secondary text-text-dark"
      } ${
        !targetBlockId
          ? "hover:outline-red-200 focus-within:outline-red-200"
          : "focus-within:bg-primary-darker focus-within:text-text-dark"
      } min-w-[7rem] text-[1.5rem] outline-none rounded-md px-[1rem] py-[.5rem] shadow-sm transition-all hover:bg-primary-darker hover:text-text-light focus-within:text-text-light`}
    >
      {isElse ? "else" : conditionType}
    </button>
  );
}
