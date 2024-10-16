import { useEffect, useState } from "react";
import plus from "../../../../../../assets/images/shared/add.png";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useGetConditionBlocksByCommandConditionId from "../hooks/Condition/ConditionBlock/useGetConditionBlocksByCommandConditionId";
import useGetCommandCondition from "../hooks/Condition/useGetCommandCondition";
import ConditionBlockItem from "./ConditionBlockItem";
import useConditionBlocks, {
  ConditionBlockItemTypes,
} from "./Context/ConditionContext";
import CreateConditionValueTypeModal from "./CreateConditionValueTypeModal";
import PlotfieldInsideConditionBlock from "./PlotfieldInsideConditionBlock/PlotfieldInsideConditionBlock";

type CommandConditionFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandConditionField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandConditionFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Condition");

  const { getAllConditionBlocksByPlotfieldCommandId, setConditionBlocks } =
    useConditionBlocks();
  const [showCreateValueType, setShowCreateValueType] = useState(false);
  const { data: commandCondition } = useGetCommandCondition({
    plotFieldCommandId,
  });
  const [showConditionBlockPlot, setShowConditionBlockPlot] = useState(false);
  const [commandConditionId, setCommandConditionId] = useState("");

  useEffect(() => {
    if (commandCondition) {
      setCommandConditionId(commandCondition._id);
    }
  }, [commandCondition]);

  const { data: conditionBlocks } = useGetConditionBlocksByCommandConditionId({
    commandConditionId,
  });

  useEffect(() => {
    if (conditionBlocks) {
      if (
        !getAllConditionBlocksByPlotfieldCommandId({
          plotfieldCommandId: plotFieldCommandId,
        }).length
      ) {
        setConditionBlocks({
          conditionBlocks,
          plotfieldCommandId: plotFieldCommandId,
        });
      }
    }
  }, [conditionBlocks]);

  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col">
      <div className="min-w-[10rem] flex-grow w-full relative flex items-start gap-[1rem]">
        <h3 className="text-[1.4rem] text-start text-text-light outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary text-gray-600 cursor-default">
          {nameValue}
        </h3>
        <ButtonHoverPromptModal
          contentName="Создать Блок"
          positionByAbscissa="right"
          className="shadow-sm shadow-gray-400 active:scale-[.99] relative bg-secondary z-[2]"
          asideClasses="text-[1.3rem] -translate-y-1/3 text-text-light"
          onClick={(e) => {
            e.stopPropagation();
            setShowCreateValueType((prev) => !prev);
          }}
          variant="rectangle"
        >
          <img
            src={plus}
            alt="Commands"
            className="w-[3.5rem] h-full p-[.2rem]"
          />
        </ButtonHoverPromptModal>

        <CreateConditionValueTypeModal
          setShowCreateValueType={setShowCreateValueType}
          showCreateValueType={showCreateValueType}
          commandConditionId={commandConditionId}
          plotfieldCommandId={plotFieldCommandId}
        />
      </div>

      <ConditionBlocksList
        commandConditionId={commandConditionId}
        topologyBlockId={topologyBlockId}
        plotFieldCommandId={plotFieldCommandId}
        setShowConditionBlockPlot={setShowConditionBlockPlot}
        showConditionBlockPlot={showConditionBlockPlot}
      />
    </div>
  );
}

type ConditionBlocksListTypes = {
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
  showConditionBlockPlot: boolean;
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
};

function ConditionBlocksList({
  setShowConditionBlockPlot,
  plotFieldCommandId,
  commandConditionId,
  topologyBlockId,
  showConditionBlockPlot,
}: ConditionBlocksListTypes) {
  const { getAllConditionBlocksElseOrIfByPlotfieldCommandId } =
    useConditionBlocks();
  return (
    <div className={`w-full bg-primary rounded-md p-[.5rem]`}>
      <div
        className={`${
          showConditionBlockPlot ? "" : "hidden"
        } flex flex-col gap-[1rem]`}
      >
        <PlotfieldInsideConditionBlock
          plotfieldCommandId={plotFieldCommandId}
          setShowConditionBlockPlot={setShowConditionBlockPlot}
          showConditionBlockPlot={showConditionBlockPlot}
        />
      </div>
      <div
        className={`${
          showConditionBlockPlot ? "hidden" : ""
        } flex flex-col gap-[1rem]`}
      >
        {(
          getAllConditionBlocksElseOrIfByPlotfieldCommandId({
            plotfieldCommandId: plotFieldCommandId,
            isElse: false,
          }) as ConditionBlockItemTypes[]
        ).length ? (
          <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[1rem] w-full bg-primary rounded-md`}
          >
            {(
              getAllConditionBlocksElseOrIfByPlotfieldCommandId({
                plotfieldCommandId: plotFieldCommandId,
                isElse: false,
              }) as ConditionBlockItemTypes[]
            )?.map((p) => (
              <ConditionBlockItem
                key={p.conditionBlockId}
                {...p}
                setShowConditionBlockPlot={setShowConditionBlockPlot}
                currentTopologyBlockId={topologyBlockId}
                conditionId={commandConditionId}
                plotfieldCommandId={plotFieldCommandId}
              />
            ))}
          </div>
        ) : null}
        <div className="min-w-[10rem] w-full relative flex gap-[.5rem] flex-wrap bg-secondary rounded-md">
          <h3 className="text-[1.4rem] min-w-[15rem] text-start text-text-light outline-gray-300 w-full m-[.5rem] capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-secondary text-gray-600 cursor-default">
            Else
          </h3>
          <ConditionBlockElse
            plotFieldCommandId={plotFieldCommandId}
            topologyBlockId={topologyBlockId}
            commandConditionId={commandConditionId}
            setShowConditionBlockPlot={setShowConditionBlockPlot}
          />
        </div>
      </div>
    </div>
  );
}

type ConditionBlockElseTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

function ConditionBlockElse({
  setShowConditionBlockPlot,
  plotFieldCommandId,
  topologyBlockId,
  commandConditionId,
}: ConditionBlockElseTypes) {
  const { getAllConditionBlocksElseOrIfByPlotfieldCommandId } =
    useConditionBlocks();

  return (
    <>
      {(getAllConditionBlocksElseOrIfByPlotfieldCommandId({
        plotfieldCommandId: plotFieldCommandId,
        isElse: true,
      }) as ConditionBlockItemTypes) ? (
        <ConditionBlockItem
          setShowConditionBlockPlot={setShowConditionBlockPlot}
          plotfieldCommandId={plotFieldCommandId}
          currentTopologyBlockId={topologyBlockId}
          conditionId={commandConditionId}
          {...(getAllConditionBlocksElseOrIfByPlotfieldCommandId({
            plotfieldCommandId: plotFieldCommandId,
            isElse: true,
          }) as ConditionBlockItemTypes)}
        />
      ) : null}
    </>
  );
}
