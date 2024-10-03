import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useUpdateChoiceOptionOrder from "../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionOrder";

type OptionSelecteTopologyBlockTypes = {
  setShowAllOrders: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllTopologyBlocks: React.Dispatch<React.SetStateAction<boolean>>;
  choiceId: string;
  choiceOptionId: string;
  showAllOrders: boolean;
  optionOrder?: number;
  amountOfOptions: number;
  setOptionOrderToRevalidate: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  setCurrentOrder: React.Dispatch<React.SetStateAction<number | undefined>>;
  setOptionOrderIdNotToRevalidate: React.Dispatch<React.SetStateAction<string>>;
};

export default function OptionSelectOrder({
  choiceId,
  choiceOptionId,
  setShowAllOrders,
  showAllOrders,
  optionOrder,
  amountOfOptions,
  setShowAllTopologyBlocks,
  setOptionOrderIdNotToRevalidate,
  setOptionOrderToRevalidate,
  setCurrentOrder,
}: OptionSelecteTopologyBlockTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  const updateOptionOrder = useUpdateChoiceOptionOrder({
    choiceOptionId,
    choiceId,
  });

  useOutOfModal({
    modalRef,
    setShowModal: setShowAllOrders,
    showModal: showAllOrders,
  });

  return (
    <div className="relative self-end pr-[.2rem] pb-[.2rem] z-[15]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAllOrders((prev) => !prev);
          setShowAllTopologyBlocks(false);
        }}
        className="text-[1.3rem] self-end outline-gray-300 text-gray-700 shadow-md rounded-md px-[1rem] py-[.5rem] whitespace-nowrap"
        type="button"
      >
        {typeof optionOrder === "number" ? optionOrder : "Порядок Ответа"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllOrders ? "" : "hidden"
        } overflow-y-auto max-h-[15rem] z-[2] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit w-full rounded-md shadow-md bg-white right-[0rem] translate-y-[.5rem] | containerScroll`}
      >
        {amountOfOptions > 0 ? (
          [...Array.from({ length: amountOfOptions })]?.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setShowAllOrders(false);
                setOptionOrderIdNotToRevalidate(choiceOptionId);
                setOptionOrderToRevalidate(i);
                setCurrentOrder(i);
                updateOptionOrder.mutate({ optionOrder: i });
              }}
              className={`${
                optionOrder === i
                  ? "bg-primary-pastel-blue text-white"
                  : "text-gray-700 bg-white"
              } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md`}
            >
              {i}
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowAllOrders(false);
            }}
            className={` px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 text-gray-700 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md`}
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}
