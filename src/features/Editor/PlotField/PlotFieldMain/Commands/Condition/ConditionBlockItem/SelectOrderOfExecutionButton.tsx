import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useUpdateConditionBlockOrderOfExecution from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/useUpdateConditionBlockOrderOfExecution";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { useState } from "react";
import useConditionBlocks from "../Context/ConditionContext";

type SelectOrderOfExecutionButtonTypes = {
  currentOrder: number | null;
  conditionBlockId: string;
  commandConditionId: string;
  plotfieldCommandId: string;
};

export default function SelectOrderOfExecutionButton({
  commandConditionId,
  conditionBlockId,
  currentOrder,
  plotfieldCommandId,
}: SelectOrderOfExecutionButtonTypes) {
  const { getAmountOfOnlyIfConditionBlocks, updateConditionOrderOfExecution, getAllUsedOrders } = useConditionBlocks();

  const updateExecutionOrder = useUpdateConditionBlockOrderOfExecution({
    conditionBlockId,
    commandConditionId,
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const buttonsRef = useModalMovemenetsArrowUpDown({
    length: getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }),
  });

  return (
    <Popover open={showOrderModal} onOpenChange={setShowOrderModal}>
      <PopoverTrigger asChild>
        <Button className={`bg-accent hover:shadow-sm hover:shadow-accent text-text active:scale-[.99] transition-all`}>
          {typeof currentOrder === "number" ? `Порядок Выполнения - ${currentOrder}` : `Порядок Выполнения`}
        </Button>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`w-[70px] flex flex-col gap-[5px]`}>
        {Array.from({ length: getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) }, (_, i) => {
          return (
            <Button
              key={`OrderOfExecution-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                updateConditionOrderOfExecution({
                  conditionBlockId,
                  orderOfExecution: i + 1,
                  plotfieldCommandId,
                });
                updateExecutionOrder.mutate({ orderOfExecution: i + 1 });
                setShowOrderModal(false);
              }}
              className={`
                ${currentOrder === i + 1 ? "bg-accent opacity-100" : ""} ${
                getAllUsedOrders({ plotfieldCommandId }).includes(i + 1) && i + 1 !== currentOrder
                  ? "bg-accent opacity-70"
                  : ""
              }  whitespace-nowrap text-center text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] transition-all `}
            >
              {i + 1}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
