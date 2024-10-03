import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateConditionBlockOrderOfExecution from "../hooks/Condition/ConditionBlock/useUpdateConditionBlockOrderOfExecution";

type DisplayOrderOfIfsModalTypes = {
  setCurrentOrder: React.Dispatch<React.SetStateAction<number | null>>;
  currentOrder: number | null;
  amountOfIfBlocks: number;
  conditionBlockId: string;
  commandConditionId: string;
  allUsedOrderNumbers: number[];
  setAllUsedOrderNumbers?: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function DisplayOrderOfIfsModal({
  amountOfIfBlocks,
  currentOrder,
  setCurrentOrder,
  conditionBlockId,
  allUsedOrderNumbers,
  commandConditionId,
}: DisplayOrderOfIfsModalTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

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
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAllOrders((prev) => !prev);
        }}
        className="w-full flex-grow text-[1.4rem] outline-gray-300 text-gray-700 shadow-md rounded-md px-[1rem] py-[.5rem]"
        type="button"
      >
        {currentOrder || "Порядок выполнения"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllOrders ? "" : "hidden"
        } z-[10] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit rounded-md shadow-md bg-white right-[0rem] translate-y-[.5rem]`}
      >
        {Array.from({ length: amountOfIfBlocks }, (_, i) => (
          <button
            key={i + 1}
            type="button"
            onClick={() => {
              if (currentOrder === i + 1) {
                setCurrentOrder(null);
              } else {
                setShowAllOrders(false);
                setCurrentOrder(i + 1);
              }
              updateExecutionOrder.mutate({ orderOfExecution: i + 1 });
            }}
            className={`${
              currentOrder === i + 1 ? "bg-primary-pastel-blue text-white" : ""
            } ${
              allUsedOrderNumbers.includes(i + 1)
                ? "bg-primary-light-blue text-white "
                : "text-gray-700 hover:bg-primary-light-blue hover:text-white"
            } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 shadow-md transition-all rounded-md`}
          >
            {i + 1}
          </button>
        ))}
      </aside>
    </div>
  );
}
