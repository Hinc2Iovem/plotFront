import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import ConditionBlockItem from "./ConditionBlockItem/ConditionBlockItem";
import useConditionBlocks, { ConditionBlockItemTypes } from "./Context/ConditionContext";
import PlotfieldInsideConditionBlock from "./PlotfieldInsideConditionBlock/PlotfieldInsideConditionBlock";

type ConditionBlocksListTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
  isFocusedBackground: boolean;
};

export default function ConditionBlocksList({
  plotFieldCommandId,
  commandConditionId,
  topologyBlockId,
  isFocusedBackground,
}: ConditionBlocksListTypes) {
  const getAllConditionBlocksElseOrIfByPlotfieldCommandId = useConditionBlocks(
    (state) => state.getAllConditionBlocksElseOrIfByPlotfieldCommandId
  );
  const showConditionBlockPlot =
    (useConditionBlocks(
      (state) =>
        state.conditions.find((c) => c.plotfieldCommandId === plotFieldCommandId)?.currentlyOpenConditionBlockPlotId
    )?.trim().length || 0) > 0;

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
};

function ConditionBlockElse({ plotFieldCommandId, topologyBlockId, commandConditionId }: ConditionBlockElseTypes) {
  const getAllConditionBlocksElseOrIfByPlotfieldCommandId = useConditionBlocks(
    (state) => state.getAllConditionBlocksElseOrIfByPlotfieldCommandId
  );

  return (
    <>
      {(getAllConditionBlocksElseOrIfByPlotfieldCommandId({
        plotfieldCommandId: plotFieldCommandId,
        isElse: true,
      }) as ConditionBlockItemTypes) ? (
        <ConditionBlockItem
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
