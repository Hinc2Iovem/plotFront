import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateConditionBlockOrderOfExecution from "../../../hooks/Condition/ConditionBlock/useUpdateConditionBlockOrderOfExecution";
import useConditionBlocks from "./Context/ConditionContext";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";

type DisplayOrderOfIfsModalTypes = {
  currentOrder: number | null;
  conditionBlockId: string;
  commandConditionId: string;
  plotfieldCommandId: string;
};

export default function DisplayOrderOfIfsModal({
  currentOrder,
  conditionBlockId,
  commandConditionId,
  plotfieldCommandId,
}: DisplayOrderOfIfsModalTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { getAmountOfOnlyIfConditionBlocks, updateConditionOrderOfExecution, getAllUsedOrders } = useConditionBlocks();
  const [showAllOrders, setShowAllOrders] = useState(false);
  const theme = localStorage.getItem("theme");
  const updateExecutionOrder = useUpdateConditionBlockOrderOfExecution({
    conditionBlockId,
    commandConditionId,
  });

  useOutOfModal({
    setShowModal: setShowAllOrders,
    showModal: showAllOrders,
    modalRef,
  });
  return (
    <div className="relative flex-grow">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllOrders((prev) => !prev);
        }}
        type="button"
      >
        {typeof currentOrder === "number" ? `Порядок выполнения - ${currentOrder}` : "Порядок выполнения"}
      </PlotfieldButton>
      <aside
        ref={modalRef}
        className={`${
          showAllOrders ? "" : "hidden"
        } z-[10] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit rounded-md shadow-md bg-secondary right-[0rem] translate-y-[.5rem]`}
      >
        {Array.from({ length: getAmountOfOnlyIfConditionBlocks({ plotfieldCommandId }) }, (_, i) => (
          <button
            key={i + 1}
            type="button"
            onClick={() => {
              updateConditionOrderOfExecution({
                conditionBlockId,
                orderOfExecution: i + 1,
                plotfieldCommandId,
              });
              updateExecutionOrder.mutate({ orderOfExecution: i + 1 });
            }}
            className={`${currentOrder === i + 1 ? "bg-primary-darker text-text-dark" : ""} ${
              getAllUsedOrders({ plotfieldCommandId }).includes(i + 1)
                ? `bg-primary ${theme === "light" ? "text-text-dark" : "text-text-light"}`
                : "text-text-dark hover:bg-primary hover:text-text-light"
            } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } shadow-md transition-all rounded-md`}
          >
            {i + 1}
          </button>
        ))}
      </aside>
    </div>
  );
}
