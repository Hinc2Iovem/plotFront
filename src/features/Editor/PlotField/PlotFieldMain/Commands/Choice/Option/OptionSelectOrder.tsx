import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useUpdateChoiceOptionOrder from "../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionOrder";
import useChoiceOptions from "../Context/ChoiceContext";

type OptionSelecteTopologyBlockTypes = {
  setShowAllOrders: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllTopologyBlocks: React.Dispatch<React.SetStateAction<boolean>>;
  choiceId: string;
  choiceOptionId: string;
  showAllOrders: boolean;
  amountOfOptions: number;
};

export default function OptionSelectOrder({
  choiceId,
  choiceOptionId,
  setShowAllOrders,
  showAllOrders,
  amountOfOptions,
  setShowAllTopologyBlocks,
}: OptionSelecteTopologyBlockTypes) {
  const { updateChoiceOptionOrder, getChoiceOptionById } = useChoiceOptions();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
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
    <div className="relative self-end pr-[.2rem] pb-[.2rem] z-[2]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAllOrders((prev) => !prev);
          setShowAllTopologyBlocks(false);
        }}
        className={`text-[1.3rem] self-end ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker hover:bg-primary-darker shadow-md rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
        type="button"
      >
        {typeof getChoiceOptionById({ choiceId, choiceOptionId })
          ?.optionOrder === "number"
          ? getChoiceOptionById({ choiceId, choiceOptionId })?.optionOrder
          : "Порядок Ответа"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllOrders ? "" : "hidden"
        } overflow-y-auto max-h-[15rem] z-[2] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit w-full rounded-md shadow-md bg-secondary right-[0rem] translate-y-[.5rem] | containerScroll`}
      >
        {amountOfOptions > 0 ? (
          [...Array.from({ length: amountOfOptions })]?.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setShowAllOrders(false);
                updateChoiceOptionOrder({
                  choiceId,
                  choiceOptionId,
                  optionOrder: i,
                });
                updateOptionOrder.mutate({ optionOrder: i });
              }}
              className={`${
                getChoiceOptionById({ choiceId, choiceOptionId })
                  ?.optionOrder === i
                  ? "bg-primary-darker text-text-light"
                  : "text-text-dark bg-secondary"
              } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } hover:bg-primary-darker focus-within:bg-primary-darker hover:text-text-dark shadow-md transition-all rounded-md`}
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
            className={`px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-text-dark hover:bg-primary-darker focus-within:bg-primary-darker  hover:text-text-dark shadow-md transition-all rounded-md`}
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}
