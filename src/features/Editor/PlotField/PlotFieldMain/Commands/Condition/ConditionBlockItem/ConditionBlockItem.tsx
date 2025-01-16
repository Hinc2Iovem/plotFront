import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { ConditionBlockItemTypes } from "../Context/ConditionContext";
import useRefineAndAssignConditionVariations from "../hooks/useRefineAndAssignConditionVariations";
import ConditionBlockShowPlot from "./ConditionBlockShowPlot";
import ConditionBlockTopologyBlockField from "./ConditionBlockTopologyBlockField";
import ConditionValueItem from "./ConditionValueItem";
import CreateConditionVariationButton from "./CreateConditionVariationButton";
import SelectOrderOfExecutionButton from "./SelectOrderOfExecutionButton";

type ConditionBlockItemProps = {
  currentTopologyBlockId: string;
  conditionId: string;
  plotfieldCommandId: string;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
} & ConditionBlockItemTypes;

export default function ConditionBlockItem({
  setShowConditionBlockPlot,
  conditionBlockId,
  targetBlockId,
  isElse,
  orderOfExecution,
  currentTopologyBlockId,
  conditionId,
  topologyBlockName,
  plotfieldCommandId,
  conditionBlockVariations,
  logicalOperators,
}: ConditionBlockItemProps) {
  const [showCreateCondition, setShowCreateCondition] = useState(false);
  const conditionModalRef = useRef<HTMLDivElement>(null);

  useRefineAndAssignConditionVariations({ conditionBlockId, plotfieldCommandId });

  useOutOfModal({
    setShowModal: setShowCreateCondition,
    showModal: showCreateCondition,
    modalRef: conditionModalRef,
  });

  return (
    <>
      {!isElse ? (
        <div
          className={`p-[10px] h-[350px] flex flex-col gap-[10px] w-full bg-secondary rounded-md shadow-md relative`}
        >
          <div className="flex items-center w-full justify-between">
            <ConditionBlockShowPlot
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              setShowConditionBlockPlot={setShowConditionBlockPlot}
              targetBlockId={targetBlockId}
              isElse={isElse}
            />
            <CreateConditionVariationButton
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
            />
          </div>

          <div className="flex flex-col gap-[10px] h-full overflow-y-auto | containerScroll">
            <ConditionValueItem
              key={conditionBlockId}
              topologyBlockId={currentTopologyBlockId}
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              conditionBlockVariations={conditionBlockVariations}
              isElse={isElse}
              logicalOperators={logicalOperators}
              orderOfExecution={orderOfExecution}
              targetBlockId={targetBlockId}
              topologyBlockName={topologyBlockName}
            />
          </div>
          <div className="flex flex-col gap-[5px] bg-primary-darker p-[5px] rounded-md">
            <SelectOrderOfExecutionButton
              conditionBlockId={conditionBlockId}
              commandConditionId={conditionId}
              currentOrder={orderOfExecution}
              plotfieldCommandId={plotfieldCommandId}
            />
            <ConditionBlockTopologyBlockField
              conditionBlockId={conditionBlockId}
              isElse={isElse}
              plotfieldCommandId={plotfieldCommandId}
              targetBlockId={targetBlockId}
              topologyBlockName={topologyBlockName || ""}
            />
          </div>
        </div>
      ) : (
        <div className={`flex flex-wrap gap-[5px] flex-grow bg-secondary rounded-md shadow-md px-[5px] py-[5px]`}>
          <ConditionBlockShowPlot
            conditionBlockId={conditionBlockId}
            plotfieldCommandId={plotfieldCommandId}
            setShowConditionBlockPlot={setShowConditionBlockPlot}
            targetBlockId={targetBlockId}
            isElse={isElse}
          />
          <ConditionBlockTopologyBlockField
            conditionBlockId={conditionBlockId}
            isElse={isElse}
            plotfieldCommandId={plotfieldCommandId}
            targetBlockId={targetBlockId}
            topologyBlockName={topologyBlockName || ""}
          />
        </div>
      )}
    </>
  );
}
