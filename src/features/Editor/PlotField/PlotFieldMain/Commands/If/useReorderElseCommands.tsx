import { useEffect } from "react";
import useFixCommandOrder from "../../../hooks/useFixCommandOrder";
import { PlotfieldOptimisticCommandTypes } from "../../../Context/PlotfieldCommandSlice";

type ReorderIfCommandsTypes = {
  currentCommandOrdersIf:
    | {
        _id: string;
        commandOrder: number;
      }[]
    | undefined;
  currentCommandsState: PlotfieldOptimisticCommandTypes[];
  plotfieldCommandIfId: string;
  newlyFetchedIfCommands: boolean;
};

export default function useReorderElseCommands({
  currentCommandOrdersIf,
  plotfieldCommandIfId,
  currentCommandsState,
  newlyFetchedIfCommands,
}: ReorderIfCommandsTypes) {
  const updateCommandOrder = useFixCommandOrder();
  useEffect(() => {
    if (newlyFetchedIfCommands) {
      if (!currentCommandOrdersIf?.length || !plotfieldCommandIfId) {
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
  }, [currentCommandOrdersIf, plotfieldCommandIfId, currentCommandsState, newlyFetchedIfCommands]);
}
