import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import {
  ChoiceVariations,
  ChoiceVariationsTypes,
} from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type ChoiceChooseVariationTypes = {
  choiceId: string;
  showChoiceVariationTypesModal: boolean;
  setShowChoiceMultipleModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowChoiceVariationTypesModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChoiceVariationTypes: React.Dispatch<React.SetStateAction<ChoiceVariationsTypes>>;
  choiceVariationTypes: ChoiceVariationsTypes;
};

export default function ChoiceChooseVariationType({
  choiceId,
  choiceVariationTypes,
  showChoiceVariationTypesModal,
  setShowChoiceVariationTypesModal,
  setShowChoiceMultipleModal,
  setChoiceVariationTypes,
}: ChoiceChooseVariationTypes) {
  const theme = localStorage.getItem("theme");

  const updateChoice = useUpdateChoice({ choiceId });
  const choiceVariationRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef: choiceVariationRef,
    setShowModal: setShowChoiceVariationTypesModal,
    showModal: showChoiceVariationTypesModal,
  });

  return (
    <div className="relative flex-grow">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowChoiceMultipleModal(false);
          setShowChoiceVariationTypesModal((prev) => !prev);
        }}
        className={`w-full text-text-light text-start ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } h-full whitespace-nowrap text-[1.4rem] bg-secondary rounded-md shadow-md px-[1rem] py-[.5rem]`}
      >
        {choiceVariationTypes ? choiceVariationTypes : "Тип Выбора"}
      </button>

      <aside
        ref={choiceVariationRef}
        className={`${
          showChoiceVariationTypesModal ? "" : "hidden"
        } translate-y-[.5rem] absolute flex flex-col gap-[1rem] bg-primary-darker rounded-md shadow-md z-[2] min-w-fit w-full p-[.5rem]`}
      >
        {ChoiceVariations.map((cv) => (
          <button
            key={cv}
            className={`${
              cv === choiceVariationTypes ? "hidden" : ""
            } w-full text-text-dark hover:text-text-light text-start hover:bg-primary-darker focus-within:text-text-light focus-within:bg-primary-darker ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } text-[1.3rem] hover:scale-[1.01] rounded-md shadow-md bg-secondary px-[1rem] py-[.5rem]`}
            onClick={() => {
              setChoiceVariationTypes(cv);
              setShowChoiceVariationTypesModal(false);
              if (cv === "common") {
                updateChoice.mutate({ choiceType: "common" });
              }
            }}
          >
            {cv}
          </button>
        ))}
      </aside>
    </div>
  );
}
