import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import ConditionBlockItem from "./ConditionBlockItem/ConditionBlockItem";
import useConditionBlocks, { ConditionBlockItemTypes } from "./Context/ConditionContext";
import PlotfieldInsideConditionBlock from "./PlotfieldInsideConditionBlock/PlotfieldInsideConditionBlock";

type ConditionBlocksListTypes = {
  showConditionBlockPlot: boolean;
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
  isFocusedBackground: boolean;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ConditionBlocksList({
  plotFieldCommandId,
  commandConditionId,
  topologyBlockId,
  showConditionBlockPlot,
  isFocusedBackground,
  setShowConditionBlockPlot,
}: ConditionBlocksListTypes) {
  const { getAllConditionBlocksElseOrIfByPlotfieldCommandId } = useConditionBlocks();

  return (
    <div className={`w-full rounded-md p-[5px]`}>
      <div className={`${showConditionBlockPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[10px]`}>
        <PlotfieldInsideConditionBlock
          topologyBlockId={topologyBlockId}
          isFocusedBackground={isFocusedBackground}
          plotfieldCommandId={plotFieldCommandId}
          showConditionBlockPlot={showConditionBlockPlot}
        />
      </div>
      <div className={`${showConditionBlockPlot || isFocusedBackground ? "hidden" : ""} flex flex-col gap-[10px]`}>
        {(
          getAllConditionBlocksElseOrIfByPlotfieldCommandId({
            plotfieldCommandId: plotFieldCommandId,
            isElse: false,
          }) as ConditionBlockItemTypes[]
        ).length ? (
          <div className={`grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[10px] w-full rounded-md`}>
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
        <div className="min-w-[100px] w-full relative flex gap-[5px] flex-wrap bg-secondary rounded-md">
          <PlotfieldCommandNameField className={`text-[25px]`}>Else</PlotfieldCommandNameField>
          <ConditionBlockElse
            setShowConditionBlockPlot={setShowConditionBlockPlot}
            plotFieldCommandId={plotFieldCommandId}
            topologyBlockId={topologyBlockId}
            commandConditionId={commandConditionId}
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
  plotFieldCommandId,
  topologyBlockId,
  commandConditionId,
  setShowConditionBlockPlot,
}: ConditionBlockElseTypes) {
  const { getAllConditionBlocksElseOrIfByPlotfieldCommandId } = useConditionBlocks();

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
