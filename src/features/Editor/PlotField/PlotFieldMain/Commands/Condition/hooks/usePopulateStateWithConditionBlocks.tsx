import { useEffect } from "react";
import useGetConditionBlocksByCommandConditionId from "../../../../hooks/Condition/ConditionBlock/useGetConditionBlocksByCommandConditionId";
import useUpdateCurrentlyOpenConditionBlockOnMount from "../../../../hooks/Condition/helpers/useUpdateCurrentlyOpenConditionBlockOnMount";
import useConditionBlocks, { ConditionBlockItemTypes } from "../Context/ConditionContext";

type PopulateStateWithConditionBlocksTypes = {
  commandConditionId: string;
  plotFieldCommandId: string;
};

export default function usePopulateStateWithConditionBlocks({
  commandConditionId,
  plotFieldCommandId,
}: PopulateStateWithConditionBlocksTypes) {
  const { setConditionBlocks } = useConditionBlocks();

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
}
