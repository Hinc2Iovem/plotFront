import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { ChoiceVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type ChoiceTypeModalTypes = {
  setChoiceType: React.Dispatch<React.SetStateAction<ChoiceVariationsTypes>>;
  choiceType: ChoiceVariationsTypes;
};

const ALL_POSSIBLE_CHOICE_VARIATIONS: ChoiceVariationsTypes[] = [
  "common",
  "multiple",
  "timelimit",
];

export default function ChoiceTypeModal({
  choiceType,
  setChoiceType,
}: ChoiceTypeModalTypes) {
  const [showChoiceTypes, setShowChoiceTypes] = useState(false);
  const modalChoiceTypeRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef: modalChoiceTypeRef,
    showModal: showChoiceTypes,
    setShowModal: setShowChoiceTypes,
  });

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowChoiceTypes((prev) => !prev);
        }}
        className="shadow-md rounded-md bg-secondary text-[1.5rem] outline-black px-[1rem] py-[.5rem]"
      >
        {choiceType ? choiceType : "Тип Выбора"}
      </button>
      <aside
        ref={modalChoiceTypeRef}
        className={`${
          showChoiceTypes ? "" : "hidden"
        } w-full min-w-fit right-0 absolute flex flex-col gap-[.5rem] bg-secondary shadow-md p-[1rem] translate-y-[.5rem]`}
      >
        {ALL_POSSIBLE_CHOICE_VARIATIONS.map((cv) => (
          <button
            key={cv}
            onClick={() => {
              setShowChoiceTypes(false);
              setChoiceType(cv);
            }}
            className={`${
              cv === choiceType
                ? " bg-primary-darker text-text-dark"
                : "text-black bg-secondary"
            } shadow-md hover:text-text-dark hover:bg-primary-darker focus-within:text-text-dark focus-within:bg-primary-darker transition-all capitalize rounded-md text-[1.5rem] outline-none px-[1rem] py-[.5rem]`}
          >
            {cv}
          </button>
        ))}
      </aside>
    </div>
  );
}
