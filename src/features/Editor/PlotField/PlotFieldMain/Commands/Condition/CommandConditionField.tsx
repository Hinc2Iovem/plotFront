import { useEffect, useState } from "react";
import plus from "../../../../../../assets/images/shared/add.png";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useGetConditionBlocksByCommandConditionId from "../../../hooks/Condition/ConditionBlock/useGetConditionBlocksByCommandConditionId";
import useCheckIfShowingPlotfieldInsideConditionOnMount from "../../../hooks/Condition/helpers/useCheckIfShowingPlotfieldInsideConditionOnMount";
import useGoingDownInsideConditionBlocks from "../../../hooks/Condition/helpers/useGoingDownInsideConditionBlocks";
import useGoingUpFromConditionBlocks from "../../../hooks/Condition/helpers/useGoingUpFromConditionBlocks";
import useHandleNavigationThroughBlocksInsideCondition from "../../../hooks/Condition/helpers/useHandleNavigationThroughBlocksInsideCondition";
import useUpdateCurrentlyOpenConditionBlockOnMount from "../../../hooks/Condition/helpers/useUpdateCurrentlyOpenConditionBlockOnMount";
import useGetCommandCondition from "../../../hooks/Condition/useGetCommandCondition";
import ConditionBlockItem from "./ConditionBlockItem";
import useConditionBlocks, { ConditionBlockItemTypes } from "./Context/ConditionContext";
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

  const { setConditionBlocks } = useConditionBlocks();

  const [isFocusedIf, setIsFocusedIf] = useState(true);
  const [isFocusedBackground, setIsFocusedBackground] = useState(false);
  const [showConditionBlockPlot, setShowConditionBlockPlot] = useState(false);

  useCheckIfShowingPlotfieldInsideConditionOnMount({
    plotFieldCommandId,
    setIsFocusedBackground,
    setShowConditionBlockPlot,
  });

  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
    setIsFocusedIf,
  });
  const [commandConditionId, setCommandConditionId] = useState("");

  useGoingDownInsideConditionBlocks({
    conditionId: commandConditionId,
    plotfieldCommandId: plotFieldCommandId,
    setIsFocusedBackground,
    setShowConditionBlockPlot,
  });

  useGoingUpFromConditionBlocks({
    conditionId: commandConditionId,
    plotfieldCommandId: plotFieldCommandId,
    setIsFocusedBackground,
    setShowConditionBlockPlot,
  });

  useHandleNavigationThroughBlocksInsideCondition({
    plotfieldCommandId: plotFieldCommandId,
  });

  const [showCreateValueType, setShowCreateValueType] = useState(false);
  const { data: commandCondition } = useGetCommandCondition({
    plotFieldCommandId,
  });

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
      const finedConditionBlocks: ConditionBlockItemTypes[] = [];
      conditionBlocks.map((co) => {
        finedConditionBlocks.push({
          isElse: co.isElse,
          conditionBlockId: co._id,
          conditionBlockVariations: [],
          logicalOperators: co.logicalOperator,
          orderOfExecution: co.orderOfExecution,
          targetBlockId: co.targetBlockId,
          topologyBlockName: "",
        });
      });

      setConditionBlocks({
        conditionBlocks: finedConditionBlocks,
        plotfieldCommandId: plotFieldCommandId,
      });
    }
  }, [conditionBlocks]);

  useUpdateCurrentlyOpenConditionBlockOnMount({
    conditionBlocks,
    plotFieldCommandId,
  });

  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col relative">
      <div className="min-w-[10rem] flex-grow w-full relative flex items-start gap-[1rem]">
        <PlotfieldCommandNameField
          className={`${
            !isFocusedBackground && isCommandFocused && isFocusedIf ? "bg-dark-dark-blue" : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
        <ButtonHoverPromptModal
          contentName="Создать Блок"
          positionByAbscissa="right"
          className="active:scale-[.99] relative bg-secondary z-[2]"
          asideClasses="text-[1.3rem] -translate-y-1/3 text-text-light"
          onClick={(e) => {
            e.stopPropagation();
            setShowCreateValueType((prev) => !prev);
          }}
          variant="rectangle"
        >
          <img src={plus} alt="Commands" className="w-[3.5rem] h-full p-[.2rem]" />
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
        setIsFocusedBackground={setIsFocusedBackground}
        setShowConditionBlockPlot={setShowConditionBlockPlot}
        showConditionBlockPlot={showConditionBlockPlot}
        isCommandFocused={isCommandFocused}
        isFocusedIf={isFocusedIf}
        isFocusedBackground={isFocusedBackground}
      />
    </div>
  );
}

type ConditionBlocksListTypes = {
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
  showConditionBlockPlot: boolean;
  plotFieldCommandId: string;
  topologyBlockId: string;
  commandConditionId: string;
  isFocusedIf: boolean;
  isCommandFocused: boolean;
  isFocusedBackground: boolean;
};

function ConditionBlocksList({
  setIsFocusedBackground,
  setShowConditionBlockPlot,
  plotFieldCommandId,
  commandConditionId,
  topologyBlockId,
  showConditionBlockPlot,
  isCommandFocused,
  isFocusedIf,
  isFocusedBackground,
}: ConditionBlocksListTypes) {
  const { getAllConditionBlocksElseOrIfByPlotfieldCommandId } = useConditionBlocks();

  return (
    <div className={`w-full bg-primary rounded-md p-[.5rem]`}>
      <div className={`${showConditionBlockPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[1rem]`}>
        <PlotfieldInsideConditionBlock
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
            className={`${
              !isFocusedBackground && isCommandFocused && !isFocusedIf ? "bg-dark-dark-blue" : "bg-secondary"
            }`}
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
