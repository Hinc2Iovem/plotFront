import { useEffect, useMemo, useState } from "react";
import commandImg from "../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../assets/images/shared/add.png";
import ButtonHoverPromptModal from "../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useAddAnotherConditionBlock from "../hooks/Condition/ConditionBlock/useAddAnotherConditionBlock";
import useGetConditionBlocksByCommandConditionId from "../hooks/Condition/ConditionBlock/useGetConditionBlocksByCommandConditionId";
import useGetCommandCondition from "../hooks/Condition/useGetCommandCondition";
import ConditionBlockItem from "./ConditionBlockItem";

type CommandConditionFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandConditionField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandConditionFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Condition");

  const { data: commandCondition } = useGetCommandCondition({
    plotFieldCommandId,
  });
  const [commandConditionId, setCommandConditionId] = useState("");
  const createCommandinsideCondition = useAddAnotherConditionBlock({
    commandConditionId,
  });

  useEffect(() => {
    if (commandCondition) {
      setCommandConditionId(commandCondition._id);
    }
  }, [commandCondition]);

  const { data: conditionBlocks } = useGetConditionBlocksByCommandConditionId({
    commandConditionId,
  });

  const memoizedConditionBlocksWithoutElse = useMemo(() => {
    const res = [...(conditionBlocks || [])].filter((cb) => !cb.isElse);
    return res;
  }, [conditionBlocks]);

  const [amountOfIfBlocks, setAmountOfIfBlocks] = useState(
    memoizedConditionBlocksWithoutElse?.length || 0
  );

  useEffect(() => {
    if (memoizedConditionBlocksWithoutElse) {
      setAmountOfIfBlocks(memoizedConditionBlocksWithoutElse.length);
    }
  }, [memoizedConditionBlocksWithoutElse]);

  const [allUsedOrderNumbers, setAllUsedOrderNumbers] = useState<number[]>([]);

  useEffect(() => {
    if (conditionBlocks) {
      const ordersArr: number[] = [];
      for (const c of conditionBlocks) {
        if (c.orderOfExecution) {
          ordersArr.push(c.orderOfExecution);
        }
      }
      setAllUsedOrderNumbers(ordersArr);
    }
  }, [conditionBlocks]);

  return (
    <div className="flex gap-[1rem] w-full bg-primary-light-blue rounded-md p-[.5rem] flex-col">
      <div className="min-w-[10rem] flex-grow w-full relative flex items-center gap-[1rem]">
        <h3 className="text-[1.4rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white text-gray-600 cursor-default">
          {nameValue}
        </h3>
        <ButtonHoverPromptModal
          contentName="Создать Блок"
          positionByAbscissa="right"
          className="shadow-sm shadow-gray-400 active:scale-[.99] relative bg-white z-[2]"
          asideClasses="text-[1.3rem] -translate-y-1/3"
          onClick={() => createCommandinsideCondition.mutate()}
          variant="rectangle"
        >
          <img
            src={plus}
            alt="+"
            className="w-[1.5rem] absolute translate-y-1/2 -translate-x-1/2 left-[0rem] bottom-0"
          />
          <img src={commandImg} alt="Commands" className="w-[3rem]" />
        </ButtonHoverPromptModal>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-[1rem] w-full bg-neutral-magnolia rounded-md">
        {memoizedConditionBlocksWithoutElse?.map((p) => (
          <ConditionBlockItem
            key={p._id}
            currentTopologyBlockId={topologyBlockId}
            allUsedOrderNumbers={allUsedOrderNumbers}
            amountOfIfBlocks={amountOfIfBlocks}
            {...p}
          />
        ))}
      </div>
      <div className="min-w-[10rem] flex-grow w-full relative flex items-center gap-[1rem]">
        <h3 className="text-[1.4rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white text-gray-600 cursor-default">
          Else
        </h3>
        {conditionBlocks?.map((p) => {
          if (p.isElse) {
            return (
              <ConditionBlockItem
                key={p._id}
                currentTopologyBlockId={topologyBlockId}
                {...p}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
