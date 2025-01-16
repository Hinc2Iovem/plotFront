import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import {
  AllConditionVariationsRus,
  ConditionValueVariationType,
} from "@/types/StoryEditor/PlotField/Condition/ConditionTypes";
import { useState } from "react";

type CreateVariationButtonTypes = {
  buttonClasses: string;
  handleCreatingVariation: ({ value }: { value: ConditionValueVariationType }) => void;
};

export default function CreateVariationButton({ buttonClasses, handleCreatingVariation }: CreateVariationButtonTypes) {
  const [showConditionBlockModal, setShowConditionBlockModal] = useState(false);
  const buttonsRef = useModalMovemenetsArrowUpDown({ length: AllConditionVariationsRus.length });

  return (
    <Popover open={showConditionBlockModal} onOpenChange={setShowConditionBlockModal}>
      <PopoverTrigger asChild>
        <Button
          className={`${
            showConditionBlockModal
              ? "bg-background text-text"
              : "bg-brand-gradient text-white hover:shadow-md hover:shadow-brand-gradient-left focus-within:shadow-brand-gradient-left focus-within:shadow-md"
          } ${buttonClasses} active:scale-[.99] transition-all`}
        >
          + Условие
        </Button>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {AllConditionVariationsRus?.map((c, i) => {
          return (
            <Button
              key={`${c}-${i}`}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                const toEng: ConditionValueVariationType =
                  c === "Внешний Вид"
                    ? "appearance"
                    : c === "Ключ"
                    ? "key"
                    : c === "Кол Прохождений"
                    ? "retry"
                    : c === "Персонаж"
                    ? "character"
                    : c === "Рандом"
                    ? "random"
                    : c === "Статус"
                    ? "status"
                    : c === "Характеристика"
                    ? "characteristic"
                    : "language";

                handleCreatingVariation({ value: toEng });
                setShowConditionBlockModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {c}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
