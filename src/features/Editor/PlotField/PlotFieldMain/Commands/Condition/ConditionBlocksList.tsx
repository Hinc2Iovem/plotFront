import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import ConditionBlockItem from "./ConditionBlockItem/ConditionBlockItem";
import useConditionBlocks, { ConditionBlockItemTypes } from "./Context/ConditionContext";
import PlotfieldInsideConditionBlock from "./PlotfieldInsideConditionBlock/PlotfieldInsideConditionBlock";

type ConditionBlocksListTypes = {
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  showConditionBlockPlot: boolean;
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
  isCommandFocused: boolean;
  isFocusedBackground: boolean;
};

export default function ConditionBlocksList({
  setIsFocusedBackground,
  setShowConditionBlockPlot,
  plotFieldCommandId,
  commandConditionId,
  topologyBlockId,
  showConditionBlockPlot,
  isCommandFocused,
  isFocusedBackground,
}: ConditionBlocksListTypes) {
  const { getAllConditionBlocksElseOrIfByPlotfieldCommandId } = useConditionBlocks();

  return (
    <div className={`w-full bg-primary rounded-md p-[.5rem]`}>
      <div className={`${showConditionBlockPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[1rem]`}>
        <PlotfieldInsideConditionBlock
          topologyBlockId={topologyBlockId}
          isFocusedBackground={isFocusedBackground}
          plotfieldCommandId={plotFieldCommandId}
          setShowConditionBlockPlot={setShowConditionBlockPlot}
          setIsFocusedBackground={setIsFocusedBackground}
          showConditionBlockPlot={showConditionBlockPlot}
        />
      </div>
      <div className={`${showConditionBlockPlot || isFocusedBackground ? "hidden" : ""} flex flex-col gap-[1rem]`}>
        {(
          getAllConditionBlocksElseOrIfByPlotfieldCommandId({
            plotfieldCommandId: plotFieldCommandId,
            isElse: false,
          }) as ConditionBlockItemTypes[]
        ).length ? (
          <div
            className={`grid grid-cols-[repeat(auto-fill,minmax(40rem,1fr))] gap-[1rem] w-full bg-primary rounded-md`}
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
          <PlotfieldCommandNameField
            className={`${!isFocusedBackground && isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"}`}
          >
            Else
          </PlotfieldCommandNameField>
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
