import useUpdateLogicalOperator from "@/features/Editor/PlotField/hooks/If/BlockVariations/logicalOperator/useUpdateLogicalOperator";
import useCommandIf, {
  AllIfValueVariationByLogicalOperatorIndexTypes,
  LogicalOperatorTypes,
} from "../Context/IfContext";
import { useState } from "react";
import useDeleteLogicalOperator from "@/features/Editor/PlotField/hooks/If/BlockVariations/logicalOperator/useDeleteLogicalOperator";
import useDeleteIfVariation from "@/features/Editor/PlotField/hooks/If/BlockVariations/useDeleteIfVariation";
import LogicalOperatorModal from "../../Condition/PlotfieldInsideConditionBlock/LogicalOperatorModals";

type LogicalOperatorIfTypes = {
  currentLogicalOperator: LogicalOperatorTypes;
  ifId: string;
  plotfieldCommandId: string;
  index: number;
};

export default function LogicalOperatorIf({
  ifId,
  currentLogicalOperator,
  index,
  plotfieldCommandId,
}: LogicalOperatorIfTypes) {
  const { updateLogicalOperator, getAllIfValueVariationByLogicalOperatorIndex } = useCommandIf();
  const updateLogicalOperatorAsync = useUpdateLogicalOperator({ ifId });

  const [allIfVariations, setAllIfVariations] = useState<AllIfValueVariationByLogicalOperatorIndexTypes[]>([]);

  const { removeLogicalOperator, removeIfVariation } = useCommandIf();
  const deleteLogicalOperatorAsync = useDeleteLogicalOperator({ ifId });
  const deleteIfValueVariationsAsync = useDeleteIfVariation({});

  return (
    <LogicalOperatorModal
      triggerClasses="self-start"
      currentLogicalOperator={currentLogicalOperator}
      onContextMenu={() => {
        const allVariations = getAllIfValueVariationByLogicalOperatorIndex({
          index,
          plotfieldCommandId,
        });
        setAllIfVariations(allVariations);
      }}
      onClickChangeOperator={(value) => {
        updateLogicalOperator({ index, logicalOperator: value, plotfieldCommandId });
        updateLogicalOperatorAsync.mutate({ index, logicalOperator: value });
      }}
      onClickDeleteOperator={() => {
        removeLogicalOperator({ index, plotfieldCommandId });
        deleteLogicalOperatorAsync.mutate({ index });

        if (allIfVariations?.length > 0) {
          for (const variation of allIfVariations) {
            removeIfVariation({
              ifVariationId: variation.ifVariationId,
              plotfieldCommandId,
            });
            deleteIfValueVariationsAsync.mutate({
              type: variation.type,
              ifVariationIdBody: variation.ifVariationId,
            });
          }
        }
      }}
    />
  );
}
