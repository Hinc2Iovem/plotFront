import { useEffect, useRef, useState } from "react";
import { ChoiceVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import useGetChoiceOptionById from "../../../../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";

type ChoiceTimeLimitBlockTypes = {
  choiceId: string;
  setShowChoiceDefaultTimeLimitBlockModal: React.Dispatch<React.SetStateAction<boolean>>;
  showChoiceDefaultTimeLimitBlockModal: boolean;
  setShowChoiceVariationTypesModal: React.Dispatch<React.SetStateAction<boolean>>;
  choiceVariationTypes: ChoiceVariationsTypes;
  timeLimit: number;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  amountOfOptions: number;
  timeLimitDefaultOptionId: string;
  insidePlotfield: boolean;
};

export default function ChoiceTimeLimitBlock({
  choiceId,
  choiceVariationTypes,
  setShowChoiceDefaultTimeLimitBlockModal,
  setShowChoiceVariationTypesModal,
  showChoiceDefaultTimeLimitBlockModal,
  setTimeLimit,
  timeLimit,
  amountOfOptions,
  timeLimitDefaultOptionId,
  insidePlotfield,
}: ChoiceTimeLimitBlockTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  const updateChoice = useUpdateChoice({ choiceId });

  const { data: currentChoiceOption } = useGetChoiceOptionById({
    choiceOptionId: timeLimitDefaultOptionId,
  });

  const [currentChoiceOptionOrder, setCurrentChoiceOptionOrder] = useState<number | undefined>();

  useEffect(() => {
    if (currentChoiceOption) {
      setCurrentChoiceOptionOrder(currentChoiceOption.optionOrder);
    }
  }, [currentChoiceOption]);

  const onBlur = () => {
    if (timeLimit) {
      updateChoice.mutate({
        choiceType: choiceVariationTypes || "timelimit",
        timeLimit,
      });
    }
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowChoiceDefaultTimeLimitBlockModal,
    showModal: showChoiceDefaultTimeLimitBlockModal,
  });
  return (
    <div className={`flex ${choiceVariationTypes === "timelimit" ? "" : "hidden"} gap-[.5rem] w-full flex-wrap`}>
      <PlotfieldInput
        type="text"
        className="flex-grow"
        value={timeLimit || ""}
        onBlur={onBlur}
        onChange={(e) => setTimeLimit(+e.target.value)}
      />

      {!insidePlotfield ? (
        <>
          <PlotfieldButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowChoiceVariationTypesModal(false);
              setShowChoiceDefaultTimeLimitBlockModal((prev) => !prev);
            }}
            className="w-[calc(100%-5.5rem)]"
          >
            {typeof currentChoiceOptionOrder === "number" ? currentChoiceOptionOrder : "Дефолтный Выбор"}
          </PlotfieldButton>
          <aside
            ref={modalRef}
            className={`${
              showChoiceDefaultTimeLimitBlockModal ? "" : "hidden"
            } translate-y-[3.8rem] absolute z-10 flex flex-col gap-[1rem] bg-primary  rounded-md shadow-md w-full min-w-fit p-[.5rem]`}
          >
            {(currentChoiceOptionOrder && amountOfOptions > 1) || (!currentChoiceOptionOrder && amountOfOptions > 0) ? (
              [...Array.from({ length: amountOfOptions })]?.map((_, i) => (
                <button
                  key={i}
                  className={`${
                    i === currentChoiceOptionOrder ? "hidden" : ""
                  } text-start outline-gray-300 whitespace-nowrap text-[1.3rem] rounded-md shadow-md bg-secondary  px-[1rem] py-[.5rem]`}
                  onClick={() => {
                    setShowChoiceVariationTypesModal(false);
                    setShowChoiceDefaultTimeLimitBlockModal(false);
                    setCurrentChoiceOptionOrder(i);
                    updateChoice.mutate({
                      choiceType: choiceVariationTypes || "timelimit",
                      optionOrder: i,
                    });
                  }}
                >
                  {i}
                </button>
              ))
            ) : (
              <button
                className={`text-start outline-gray-300 text-[1.3rem] rounded-md shadow-md bg-secondary  px-[1rem] py-[.5rem]`}
                onClick={() => {
                  setShowChoiceVariationTypesModal(false);
                  setShowChoiceDefaultTimeLimitBlockModal(false);
                }}
              >
                Пусто
              </button>
            )}
          </aside>
        </>
      ) : null}
    </div>
  );
}
