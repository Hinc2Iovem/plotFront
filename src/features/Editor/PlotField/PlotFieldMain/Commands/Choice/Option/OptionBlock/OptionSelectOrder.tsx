import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { useState } from "react";
import useUpdateChoiceOptionOrder from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionOrder";
import useChoiceOptions from "../../Context/ChoiceContext";

type OptionSelecteTopologyBlockTypes = {
  choiceId: string;
  choiceOptionId: string;
  amountOfOptions: number;
};

export default function OptionSelectOrder({
  choiceId,
  choiceOptionId,
  amountOfOptions,
}: OptionSelecteTopologyBlockTypes) {
  const { updateChoiceOptionOrder, getChoiceOptionById } = useChoiceOptions();
  const updateOptionOrder = useUpdateChoiceOptionOrder({
    choiceOptionId,
    choiceId,
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const buttonsRef = useModalMovemenetsArrowUpDown({
    length: amountOfOptions,
  });

  return (
    <Popover open={showOrderModal} onOpenChange={setShowOrderModal}>
      <PopoverTrigger asChild>
        <Button
          className={`bg-accent ml-auto hover:shadow-sm hover:shadow-accent text-text active:scale-[.99] transition-all`}
        >
          {typeof getChoiceOptionById({ choiceId, choiceOptionId })?.optionOrder === "number"
            ? `Порядок Ответа - ${(getChoiceOptionById({ choiceId, choiceOptionId })?.optionOrder || 0) + 1}`
            : "Порядок Ответа"}
        </Button>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`w-[70px] flex flex-col gap-[5px]`}>
        {Array.from({ length: amountOfOptions }, (_, i) => {
          return (
            <Button
              key={`OrderOfExecution-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                updateChoiceOptionOrder({
                  choiceId,
                  choiceOptionId,
                  optionOrder: i,
                });
                updateOptionOrder.mutate({ optionOrder: i });
                setShowOrderModal(false);
              }}
              className={`
               ${
                 getChoiceOptionById({ choiceId, choiceOptionId })?.optionOrder === i ? "bg-accent opacity-100" : ""
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
