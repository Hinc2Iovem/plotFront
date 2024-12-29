import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { PossibleWardrobeAppearancePartVariationsTypes } from "./WardrobeCharacterAppearancePartForm";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";

const PossibleWardrobeAppearancePartVariations = ["Волосы", "Внешний вид", "Остальное"];

type CommandWardrobeChoosingAppearanceTypeTypes = {
  showAppearancePartVariationModal: boolean;
  setShowAppearancePartVariationModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAppearancePartModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAppearancePartVariationType: React.Dispatch<React.SetStateAction<PossibleWardrobeAppearancePartVariationsTypes>>;
};

export default function CommandWardrobeChoosingAppearanceType({
  showAppearancePartVariationModal,
  setShowAppearancePartVariationModal,
  setShowCharacterModal,
  setShowAppearancePartModal,
  setAppearancePartVariationType,
}: CommandWardrobeChoosingAppearanceTypeTypes) {
  const appearancePartVariationTypeRef = useRef<HTMLDivElement>(null);

  const [transmittingAppearancePartVariableEngToRus, setTransmittingAppearancePartVariableEngToRus] = useState("");

  useOutOfModal({
    showModal: showAppearancePartVariationModal,
    setShowModal: setShowAppearancePartVariationModal,
    modalRef: appearancePartVariationTypeRef,
  });
  return (
    <div className="w-full relative">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAppearancePartModal(false);
          setShowCharacterModal(false);
          setShowAppearancePartVariationModal((prev) => !prev);
        }}
        type="button"
      >
        {transmittingAppearancePartVariableEngToRus || "Тип Одежды"}
      </PlotfieldButton>

      <AsideScrollable
        ref={appearancePartVariationTypeRef}
        className={`${showAppearancePartVariationModal ? "" : "hidden"} translate-y-[.5rem]`}
      >
        {PossibleWardrobeAppearancePartVariations.map((p) => (
          <AsideScrollableButton
            key={p}
            type="button"
            onClick={() => {
              if (p === transmittingAppearancePartVariableEngToRus) {
                setTransmittingAppearancePartVariableEngToRus("");
                setAppearancePartVariationType("" as PossibleWardrobeAppearancePartVariationsTypes);
                setShowAppearancePartVariationModal(false);
                return;
              }
              if (p === "Волосы") {
                setTransmittingAppearancePartVariableEngToRus("Волосы");
                setAppearancePartVariationType("hair");
              } else if (p === "Внешний вид") {
                setTransmittingAppearancePartVariableEngToRus("Внешний вид");
                setAppearancePartVariationType("dress");
              } else {
                setTransmittingAppearancePartVariableEngToRus("Остальное");
                setAppearancePartVariationType("temp");
              }
              setShowAppearancePartVariationModal(false);
            }}
            className={`${
              transmittingAppearancePartVariableEngToRus === p ? "bg-primary text-text-light" : ""
            } text-start`}
          >
            {p}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
    </div>
  );
}
