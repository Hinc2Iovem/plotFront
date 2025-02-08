import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import command from "../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../assets/images/shared/add.png";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import useCreateBlankCommand from "../../../../hooks/useCreateBlankCommand";
import PlotFieldMain from "../../../PlotFieldMain";
import { ConditionBlockItemTypes } from "../Context/ConditionContext";
import useConditionBlocks from "../Context/ConditionContext";
import ConditionBlockInputField from "./ConditionBlockInputField";
import usePlotfieldCommands from "@/features/Editor/PlotField/Context/PlotFieldContext";

type PlotfieldInsideConditionBlockTypes = {
  showConditionBlockPlot: boolean;
  isFocusedBackground: boolean;
  plotfieldCommandId: string;
  topologyBlockId: string;
};

export default function PlotfieldInsideConditionBlock({
  showConditionBlockPlot,
  plotfieldCommandId,
  topologyBlockId,
  isFocusedBackground,
}: PlotfieldInsideConditionBlockTypes) {
  const { episodeId } = useParams();
  const getCurrentAmountOfCommands = usePlotfieldCommands((state) => state.getCurrentAmountOfCommands);
  const getCurrentlyOpenConditionBlock = useConditionBlocks((state) => state.getCurrentlyOpenConditionBlock);
  const getCurrentlyOpenConditionBlockPlotId = useConditionBlocks(
    (state) => state.getCurrentlyOpenConditionBlockPlotId
  );
  const getAllConditionBlocksByPlotfieldCommandId = useConditionBlocks(
    (state) => state.getAllConditionBlocksByPlotfieldCommandId
  );
  const getAllConditionBlocksElseOrIfByPlotfieldCommandId = useConditionBlocks(
    (state) => state.getAllConditionBlocksElseOrIfByPlotfieldCommandId
  );
  // const [showMessage, setShowMessage] = useState("");

  const createCommand = useCreateBlankCommand({
    topologyBlockId: getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      commandOrder: getCurrentAmountOfCommands({
        topologyBlockId: getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId || "",
      }),
      topologyBlockId: getCurrentlyOpenConditionBlock({ plotfieldCommandId })?.targetBlockId || "",
    });
  };

  return (
    <section
      className={`${showConditionBlockPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[10px] relative`}
    >
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
            topologyBlockId={topologyBlockId}
            insidePlotfield={true}
          />
        ))}
      </form>
      <header className="w-full flex gap-[5px] relative flex-wrap">
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

      <main className="flex flex-col gap-[5px] w-full ">
        <div className="flex w-full bg-secondary rounded-md shadow-sm items-center px-[5px] py-[5px]">
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
  orderOfExecution,
}: OptionVariationButtonTypes) {
  const updateCurrentlyOpenConditionBlock = useConditionBlocks((state) => state.updateCurrentlyOpenConditionBlock);
  const getCurrentlyOpenConditionBlockPlotId = useConditionBlocks(
    (state) => state.getCurrentlyOpenConditionBlockPlotId
  );

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        if (targetBlockId) {
          if (getCurrentlyOpenConditionBlockPlotId({ plotfieldCommandId }) === conditionBlockId) {
            return;
          }
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
          ? "bg-accent shadow-md shadow-accent scale-[1.05]"
          : "bg-secondary"
      } ${
        isFocusedBackground && getCurrentlyOpenConditionBlockPlotId({ plotfieldCommandId }) === conditionBlockId
          ? "bg-background border-border border-[3px]"
          : ""
      } ${
        !targetBlockId ? "hover:outline-red focus-within:outline-red" : "focus-within:bg-accent"
      } text-text w-fit outline-none rounded-md px-[10px] py-[5px] shadow-sm transition-all hover:bg-accent`}
    >
      {isElse ? "else" : typeof orderOfExecution === "number" ? `Условие - ${orderOfExecution}` : topologyBlockName}
    </Button>
  );
}
