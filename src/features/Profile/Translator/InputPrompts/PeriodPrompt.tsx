import { useRef, useState } from "react";
import useOutOfModal from "../../../../hooks/UI/useOutOfModal";
import { UpdatedAtPossibleVariationTypes } from "../Recent/Filters/FiltersEverythingRecent";

type PeriodPromptPromptTypes = {
  setPeriod: React.Dispatch<
    React.SetStateAction<UpdatedAtPossibleVariationTypes>
  >;
  period: UpdatedAtPossibleVariationTypes;
};

const ALL_TIME_PERIODS: UpdatedAtPossibleVariationTypes[] = [
  "30min",
  "1hr",
  "5hr",
  "1d",
  "3d",
  "7d",
];

export default function PeriodPrompt({
  setPeriod,
  period,
}: PeriodPromptPromptTypes) {
  const [showPeriodPrompts, setShowPeriodPrompts] = useState(false);

  const modalPeriodPromptsRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef: modalPeriodPromptsRef,
    setShowModal: setShowPeriodPrompts,
    showModal: showPeriodPrompts,
  });
  return (
    <div className="bg-secondary rounded-md shadow-md relative">
      <button
        className="w-full rounded-md shadow-md bg-secondary text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
        onClick={(e) => {
          e.stopPropagation();
          setShowPeriodPrompts(true);
        }}
      >
        {period || "Промежуток Времени"}
      </button>
      <aside
        ref={modalPeriodPromptsRef}
        className={`${
          showPeriodPrompts ? "" : "hidden"
        } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
      >
        {ALL_TIME_PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setPeriod(p || "");
              setShowPeriodPrompts(false);
            }}
            className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
          >
            {p}
          </button>
        ))}
      </aside>
    </div>
  );
}
