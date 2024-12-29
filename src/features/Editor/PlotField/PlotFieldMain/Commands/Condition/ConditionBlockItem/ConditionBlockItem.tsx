import { useRef, useState } from "react";
import plus from "../../../../../../../assets/images/shared/plus.png";
import { AllPossibleConditionBlockVariations } from "../../../../../../../const/CONDITION_BLOCK_VARIATIONS";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { generateMongoObjectId } from "../../../../../../../utils/generateMongoObjectId";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import ButtonHoverPromptModal from "../../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useAddNewLogicalOperator from "../../../../hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useAddNewLogicalOperator";
import useAddNewConditionBlockVariation from "../../../../hooks/Condition/ConditionBlock/BlockVariations/useAddNewConditionBlockVariation";
import ConditionBlockShowPlot from "./ConditionBlockShowPlot";
import ConditionBlockTopologyBlockField from "./ConditionBlockTopologyBlockField";
import useConditionBlocks, { ConditionBlockItemTypes } from "../Context/ConditionContext";
import useRefineAndAssignConditionVariations from "../hooks/useRefineAndAssignConditionVariations";
import ConditionValueItem from "./ConditionValueItem";
import DisplayOrderOfIfsModal from "./DisplayOrderOfIfsModal";

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
  const { addConditionBlockVariation, getAmountOfConditionBlockVariations, addNewLogicalOperator } =
    useConditionBlocks();

  const [showCreateCondition, setShowCreateCondition] = useState(false);
  const conditionModalRef = useRef<HTMLDivElement>(null);

  useRefineAndAssignConditionVariations({ conditionBlockId, plotfieldCommandId });

  const createConditionVariation = useAddNewConditionBlockVariation({ conditionBlockId });
  const addLogicalOperator = useAddNewLogicalOperator({ conditionBlockId });

  useOutOfModal({
    setShowModal: setShowCreateCondition,
    showModal: showCreateCondition,
    modalRef: conditionModalRef,
  });

  return (
    <>
      {!isElse ? (
        <div className={`p-[1rem] flex flex-col gap-[1rem] w-full bg-secondary rounded-md shadow-md relative`}>
          <div className="relative flex gap-[1rem]">
            <ButtonHoverPromptModal
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateCondition((prev) => !prev);
              }}
              className="w-[3rem] bg-primary hover:bg-primary-darker transition-colors"
              contentName="Создать Условие"
              positionByAbscissa="left"
              asideClasses="text-text-light text-[1.3rem] translate-y-[-1rem]"
              variant="rectangle"
            >
              <img src={plus} alt="+" className="w-full mr-[1rem]" />
            </ButtonHoverPromptModal>

            <AsideScrollable
              ref={conditionModalRef}
              className={`${showCreateCondition ? "" : "hidden"} left-0 translate-y-[3.5rem]`}
            >
              {AllPossibleConditionBlockVariations.map((cbv) => (
                <AsideScrollableButton
                  key={cbv}
                  onClick={() => {
                    setShowCreateCondition(false);
                    const _id = generateMongoObjectId();
                    createConditionVariation.mutate({
                      _id,
                      type: cbv,
                    });

                    const amount = getAmountOfConditionBlockVariations({ conditionBlockId, plotfieldCommandId });

                    if (amount > 0) {
                      addNewLogicalOperator({ conditionBlockId, logicalOperator: "&&", plotfieldCommandId });
                      addLogicalOperator.mutate({ logicalOperator: "&&" });
                    }

                    addConditionBlockVariation({
                      conditionBlockId,
                      plotfieldCommandId,
                      conditionBlockVariation: {
                        conditionBlockVariationId: _id,
                        type: cbv,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      },
                    });
                  }}
                >
                  {cbv}
                </AsideScrollableButton>
              ))}
            </AsideScrollable>
          </div>

          <div className="flex flex-col gap-[1rem] ">
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
          <div className="flex flex-col gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md">
            <ConditionBlockShowPlot
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              setShowConditionBlockPlot={setShowConditionBlockPlot}
              targetBlockId={targetBlockId}
              isElse={isElse}
            />
            <DisplayOrderOfIfsModal
              conditionBlockId={conditionBlockId}
              commandConditionId={conditionId}
              currentOrder={orderOfExecution}
              plotfieldCommandId={plotfieldCommandId}
            />
            <ConditionBlockTopologyBlockField
              conditionBlockId={conditionBlockId}
              currentTopologyBlockId={currentTopologyBlockId}
              isElse={isElse}
              plotfieldCommandId={plotfieldCommandId}
              targetBlockId={targetBlockId}
              topologyBlockName={topologyBlockName || ""}
            />
          </div>
        </div>
      ) : (
        <div className={`flex flex-wrap gap-[.5rem] flex-grow bg-secondary rounded-md shadow-md px-[.5rem] py-[.5rem]`}>
          <ConditionBlockShowPlot
            conditionBlockId={conditionBlockId}
            plotfieldCommandId={plotfieldCommandId}
            setShowConditionBlockPlot={setShowConditionBlockPlot}
            targetBlockId={targetBlockId}
            isElse={isElse}
          />
          <ConditionBlockTopologyBlockField
            conditionBlockId={conditionBlockId}
            currentTopologyBlockId={currentTopologyBlockId}
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
