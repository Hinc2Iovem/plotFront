import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import { PossibleWardrobeAppearancePartVariationsTypes } from "./WardrobeCharacterAppearancePartForm";

const PossibleWardrobeAppearancePartVariations = [
  "Волосы",
  "Внешний вид",
  "Остальное",
];

type CommandWardrobeChoosingAppearanceTypeTypes = {
  showAppearancePartVariationModal: boolean;
  setShowAppearancePartVariationModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAppearancePartModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAppearancePartVariationType: React.Dispatch<
    React.SetStateAction<PossibleWardrobeAppearancePartVariationsTypes>
  >;
};

export default function CommandWardrobeChoosingAppearanceType({
  showAppearancePartVariationModal,
  setShowAppearancePartVariationModal,
  setShowCharacterModal,
  setShowAppearancePartModal,
  setAppearancePartVariationType,
}: CommandWardrobeChoosingAppearanceTypeTypes) {
  const appearancePartVariationTypeRef = useRef<HTMLDivElement>(null);

  const [
    transmittingAppearancePartVariableEngToRus,
    setTransmittingAppearancePartVariableEngToRus,
  ] = useState("");

  useOutOfModal({
    showModal: showAppearancePartVariationModal,
    setShowModal: setShowAppearancePartVariationModal,
    modalRef: appearancePartVariationTypeRef,
  });
  return (
    <div className="w-full relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAppearancePartModal(false);
          setShowCharacterModal(false);
          setShowAppearancePartVariationModal((prev) => !prev);
        }}
        type="button"
        className="w-full text-start outline-gray-300 bg-white rounded-md px-[1rem] py-[.5rem] shadow-md flex items-center justify-between"
      >
        <p className="text-[1.4rem] text-gray-700 whitespace-nowrap">
          {transmittingAppearancePartVariableEngToRus || "Тип Одежды"}
        </p>
      </button>

      <aside
        ref={appearancePartVariationTypeRef}
        className={`${
          showAppearancePartVariationModal ? "" : "hidden"
        } translate-y-[.5rem] absolute z-[10] p-[1rem] min-w-[10rem] w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
      >
        {PossibleWardrobeAppearancePartVariations.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              if (p === "Волосы") {
                setTransmittingAppearancePartVariableEngToRus("Волосы");
                setAppearancePartVariationType("hair");
              } else if (p === "Внешний вид") {
                setTransmittingAppearancePartVariableEngToRus("Внешний вид");
                setAppearancePartVariationType("dress");
              } else {
                setTransmittingAppearancePartVariableEngToRus("Остальное");
                setAppearancePartVariationType("other");
              }
              setShowAppearancePartVariationModal(false);
            }}
            className={`${
              transmittingAppearancePartVariableEngToRus === p
                ? "bg-primary-light-blue text-white"
                : ""
            } text-start outline-gray-300 text-[1.3rem] px-[1rem] py-[.5rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md`}
          >
            {p}
          </button>
        ))}
      </aside>
    </div>
  );
}
