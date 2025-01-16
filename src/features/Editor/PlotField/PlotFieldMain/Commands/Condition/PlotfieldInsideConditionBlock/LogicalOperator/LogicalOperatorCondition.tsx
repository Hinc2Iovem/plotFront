import useUpdateLogicalOperator from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useUpdateLogicalOperator";
import useConditionBlocks, {
  AllConditionValueVariationByLogicalOperatorIndexTypes,
  LogicalOperatorTypes,
} from "../../Context/ConditionContext";
import LogicalOperatorModal from "../LogicalOperatorModals";
import useDeleteLogicalOperator from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/logicalOperator/useDeleteLogicalOperator";
import useDeleteConditionBlockVariation from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/useDeleteConditionBlockVariation";
import { useState } from "react";

type LogicalOperatorConditionTypes = {
  currentLogicalOperator: LogicalOperatorTypes;
  conditionBlockId: string;
  plotfieldCommandId: string;
  index: number;
};

export default function LogicalOperatorCondition({
  currentLogicalOperator,
  conditionBlockId,
  index,
  plotfieldCommandId,
}: LogicalOperatorConditionTypes) {
  const { updateLogicalOperator, getAllConditionValueVariationByLogicalOperatorIndex } = useConditionBlocks();
  const updateLogicalOperatorAsync = useUpdateLogicalOperator({ conditionBlockId });

  const [allConditionBlockVariations, setAllConditionBlockVariations] = useState<
    AllConditionValueVariationByLogicalOperatorIndexTypes[]
  >([]);

  const { removeLogicalOperator, removeConditionBlockVariation } = useConditionBlocks();
  const deleteLogicalOperatorAsync = useDeleteLogicalOperator({ conditionBlockId });
  const deleteConditionValueVariationsAsync = useDeleteConditionBlockVariation({});

  return (
    <LogicalOperatorModal
      currentLogicalOperator={currentLogicalOperator}
      onContextMenu={() => {
        const allVariations = getAllConditionValueVariationByLogicalOperatorIndex({
          conditionBlockId,
          index,
          plotfieldCommandId,
        });
        setAllConditionBlockVariations(allVariations);
      }}
      onClickChangeOperator={(value) => {
        updateLogicalOperator({ conditionBlockId, index, logicalOperator: value, plotfieldCommandId });
        updateLogicalOperatorAsync.mutate({ index, logicalOperator: value });
      }}
      onClickDeleteOperator={() => {
        removeLogicalOperator({ conditionBlockId, index, plotfieldCommandId });
        deleteLogicalOperatorAsync.mutate({ index });

        if (allConditionBlockVariations?.length > 0) {
          for (const variation of allConditionBlockVariations) {
            removeConditionBlockVariation({
              conditionBlockId,
              conditionBlockVariationId: variation.conditionBlockVariationId,
              plotfieldCommandId,
            });
            deleteConditionValueVariationsAsync.mutate({
              conditionBlockVariationIdBody: variation.conditionBlockVariationId,
              type: variation.type,
            });
          }
        }
      }}
    />
  );
}
