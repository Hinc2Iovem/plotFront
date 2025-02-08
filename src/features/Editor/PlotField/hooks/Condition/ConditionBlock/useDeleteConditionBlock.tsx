import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import useConditionBlocks from "../../../PlotFieldMain/Commands/Condition/Context/ConditionContext";

type DeleteConditionBlockTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
};

export default function useDeleteConditionBlock({ conditionBlockId, plotfieldCommandId }: DeleteConditionBlockTypes) {
  const removeConditionBlock = useConditionBlocks((state) => state.removeConditionBlock);
  const getConditionBlockByIndex = useConditionBlocks((state) => state.getConditionBlockByIndex);
  const getAmountOfConditionBlocks = useConditionBlocks((state) => state.getAmountOfConditionBlocks);
  const getIndexOfConditionBlockById = useConditionBlocks((state) => state.getIndexOfConditionBlockById);
  const getCurrentlyOpenConditionBlock = useConditionBlocks((state) => state.getCurrentlyOpenConditionBlock);
  const updateCurrentlyOpenConditionBlock = useConditionBlocks((state) => state.updateCurrentlyOpenConditionBlock);

  useMutation({
    mutationFn: async () => await axiosCustomized.delete(`/commandConditions/conditionBlocks/${conditionBlockId}`),
    onMutate: () => {
      const currentlyOpen = getCurrentlyOpenConditionBlock({ plotfieldCommandId });
      if (currentlyOpen && currentlyOpen.conditionBlockId === conditionBlockId) {
        // if deleting on focus
        const currentBlockIndex = getIndexOfConditionBlockById({
          conditionBlockId,
          plotfieldCommandId,
        });

        if (currentBlockIndex === 0) {
          // first block deleted
          console.error("You can not remove else block");
          return;
        }

        if (typeof currentBlockIndex === "number") {
          const amount = getAmountOfConditionBlocks({ plotfieldCommandId });
          if (amount > 1) {
            // somewhere in the middle or last block
            const prevBlock = getConditionBlockByIndex({
              index: currentBlockIndex - 1,
              plotfieldCommandId,
            });

            updateCurrentlyOpenConditionBlock({
              conditionBlockId: prevBlock?.conditionBlockId || "",
              plotfieldCommandId,
            });
            removeConditionBlock({ conditionBlockId, plotfieldCommandId });
          } else {
            // just remove and close
            updateCurrentlyOpenConditionBlock({
              conditionBlockId: "",
              plotfieldCommandId,
            });
            removeConditionBlock({ conditionBlockId, plotfieldCommandId });
          }
        } else {
          // this one shouldn't trigger at all, but in case of something wierd.
          // just remove from inner state
          updateCurrentlyOpenConditionBlock({
            conditionBlockId: "",
            plotfieldCommandId,
          });
          removeConditionBlock({ conditionBlockId, plotfieldCommandId });
        }
      } else {
        // if deleting not on focus
        // just remove from inner state
        if (currentlyOpen?.isElse) {
          console.error("You can not remove else block");
          return;
        } else {
          removeConditionBlock({ conditionBlockId, plotfieldCommandId });
        }
      }
    },
  });
}
