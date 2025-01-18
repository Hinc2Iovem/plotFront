import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { ChoiceVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import PlotfieldInput from "../../../../../../../ui/Inputs/PlotfieldInput";
import useGetChoiceOptionById from "../../../../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";

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
    <div className={`flex ${choiceVariationTypes === "timelimit" ? "" : "hidden"} gap-[5px]  flex-wrap`}>
      <PlotfieldInput
        type="text"
        placeholder="20(в секундах)"
        className="flex-grow border-border border-[1px] rounded-md"
        value={timeLimit || ""}
        onBlur={onBlur}
        onChange={(e) => setTimeLimit(+e.target.value)}
      />

      {!insidePlotfield ? (
        <>
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowChoiceVariationTypesModal(false);
              setShowChoiceDefaultTimeLimitBlockModal((prev) => !prev);
            }}
            className="w-[calc(100%-55px)]"
          >
            {typeof currentChoiceOptionOrder === "number" ? currentChoiceOptionOrder : "Дефолтный Выбор"}
          </Button>
          <aside
            ref={modalRef}
            className={`${
              showChoiceDefaultTimeLimitBlockModal ? "" : "hidden"
            } translate-y-[3.8rem] absolute z-10 flex flex-col gap-[1rem] bg-primary  rounded-md shadow-md w-full min-w-fit p-[5px]`}
          >
            {(currentChoiceOptionOrder && amountOfOptions > 1) || (!currentChoiceOptionOrder && amountOfOptions > 0) ? (
              [...Array.from({ length: amountOfOptions })]?.map((_, i) => (
                <Button
                  key={i}
                  className={`${
                    i === currentChoiceOptionOrder ? "hidden" : ""
                  } text-start outline-gray-300 whitespace-nowrap text-[1.3rem] rounded-md shadow-md bg-secondary  px-[1rem] py-[5px]`}
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
                </Button>
              ))
            ) : (
              <Button
                className={`text-start outline-gray-300 text-[1.3rem] rounded-md shadow-md bg-secondary  px-[1rem] py-[5px]`}
                onClick={() => {
                  setShowChoiceVariationTypesModal(false);
                  setShowChoiceDefaultTimeLimitBlockModal(false);
                }}
              >
                Пусто
              </Button>
            )}
          </aside>
        </>
      ) : null}
    </div>
  );
}
