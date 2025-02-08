import { useEffect } from "react";
import { ConditionBlockTypes } from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type UpdateCurrentlyOpenConditionBlockOnMountTypes = {
  conditionBlocks: ConditionBlockTypes[] | undefined;
  plotFieldCommandId: string;
};

export default function useUpdateCurrentlyOpenConditionBlockOnMount({
  conditionBlocks,
  plotFieldCommandId,
}: UpdateCurrentlyOpenConditionBlockOnMountTypes) {
  const { updateCurrentlyOpenConditionBlock } = useConditionBlocks();
  useEffect(() => {
    if (conditionBlocks) {
      const focusedConditionBlocks = sessionStorage.getItem("focusedConditionBlock")?.split("?").filter(Boolean);

      const deepLevelConditionBlocks = focusedConditionBlocks?.includes("none")
        ? null
        : (focusedConditionBlocks?.length || 0) > 0
        ? (focusedConditionBlocks?.length || 0) - 1
        : null;

      if (typeof deepLevelConditionBlocks === "number") {
        const currentConditionBlock = (focusedConditionBlocks || [])[deepLevelConditionBlocks].split("-");
        const currentConditionBlockId = currentConditionBlock[1];

        updateCurrentlyOpenConditionBlock({
          conditionBlockId: currentConditionBlockId,
          plotfieldCommandId: plotFieldCommandId,
        });
      }
    }
  }, [conditionBlocks, plotFieldCommandId, updateCurrentlyOpenConditionBlock]);
}
