import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { useState } from "react";
import { LogicalOperatorTypes } from "../Context/ConditionContext";

const AllLogicalOperators = ["&&", "||"];

type LogicalOperatorModalTypes = {
  currentLogicalOperator: LogicalOperatorTypes;
  triggerClasses?: string;
  onClickChangeOperator: (value: LogicalOperatorTypes) => void;
  onClickDeleteOperator: () => void;
  onContextMenu?: () => void;
};

export default function LogicalOperatorModal({
  currentLogicalOperator,
  triggerClasses,
  onClickChangeOperator,
  onClickDeleteOperator,
  onContextMenu,
}: LogicalOperatorModalTypes) {
  const [showModal, setShowModal] = useState(false);
  const [editOrDelete, setEditOrDelete] = useState<"edit" | "delete">("" as "edit");
  const buttonsRef = useModalMovemenetsArrowUpDown({ length: 2 });
  const buttonDeleteRef = useModalMovemenetsArrowUpDown({ length: 1 });

  return (
    <Popover open={showModal} onOpenChange={setShowModal}>
      <PopoverTrigger className={`${triggerClasses ? "" : "self-end"}`} asChild>
        <Button
          onClick={() => {
            setShowModal(true);
            setEditOrDelete("edit");
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowModal(true);
            setEditOrDelete("delete");

            if (onContextMenu) {
              onContextMenu();
            }
          }}
          className={`border-[3px] text-text border-border outline-none`}
        >
          {currentLogicalOperator === "&&" ? "И" : "Или"}
        </Button>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`w-fit flex flex-col gap-[5px]`}>
        {editOrDelete === "edit" ? (
          <>
            {AllLogicalOperators?.map((c, i) => (
              <Button
                key={`${c}-${i}`}
                ref={(el) => (buttonsRef.current[i] = el)}
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onClickChangeOperator(c as LogicalOperatorTypes);
                }}
                className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
              >
                {c === "&&" ? "И" : "Или"}
              </Button>
            ))}
          </>
        ) : (
          <Button
            ref={(el) => (buttonDeleteRef.current[0] = el)}
            type="button"
            className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            onClick={() => {
              setShowModal(false);
              onClickDeleteOperator();
            }}
          >
            Удалить
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
