import { useEffect } from "react";
import { PlotfieldOptimisticCommandInsideIfTypes } from "../../../Context/PlotfieldCommandIfSlice";
import useFixCommandOrder from "../../../hooks/useFixCommandOrder";

type ReorderIfCommandsTypes = {
  currentCommandOrdersIf:
    | {
        _id: string;
        commandOrder: number;
      }[]
    | undefined;
  currentCommandsState: PlotfieldOptimisticCommandInsideIfTypes[];
  commandIfId: string;
  newlyFetchedIfCommands: boolean;
};

export default function useReorderElseCommands({
  currentCommandOrdersIf,
  commandIfId,
  currentCommandsState,
  newlyFetchedIfCommands,
}: ReorderIfCommandsTypes) {
  const updateCommandOrder = useFixCommandOrder();
  useEffect(() => {
    if (newlyFetchedIfCommands) {
      if (!currentCommandOrdersIf?.length || !commandIfId) {
        return;
      }

      console.log("Moi State: ", currentCommandsState);
      console.log("Backend State: ", currentCommandOrdersIf);

      currentCommandsState.map((c) => {
        currentCommandOrdersIf.map((cc) => {
          if (cc._id === c._id) {
            if (c.commandOrder !== cc.commandOrder) {
              updateCommandOrder.mutate({
                commandOrder: c.commandOrder,
                plotFieldCommandId: c._id,
              });
            }
          }
        });
      });
    }
  }, [currentCommandOrdersIf, commandIfId, currentCommandsState, newlyFetchedIfCommands]);
}
