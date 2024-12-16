import { useRef, useState } from "react";

import useIfVariations from "../Context/IfContext";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import {
  AllConditionSigns,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import { PlotfieldIfSingsPrompt } from "./IfVariationsField";

type IfSignFieldTypes = {
  plotfieldCommandId: string;
  ifVariationId: string;
  type: ConditionValueVariationType;
};

export default function IfSignField({ plotfieldCommandId, ifVariationId, type }: IfSignFieldTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { getIfVariationById } = useIfVariations();

  const [showSignModal, setShowSignModal] = useState(false);

  useOutOfModal({
    showModal: showSignModal,
    setShowModal: setShowSignModal,
    modalRef,
  });
  return (
    <div className="relative w-full h-full">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowSignModal((prev) => !prev);
        }}
        type="button"
        className="bg-secondary hover:bg-primary transition-all h-full"
      >
        {getIfVariationById({ plotfieldCommandId, ifVariationId })?.sign
          ? getIfVariationById({ plotfieldCommandId, ifVariationId })?.sign
          : "Знак"}
      </PlotfieldButton>
      <AsideScrollable
        ref={modalRef}
        className={` ${showSignModal ? "" : "hidden"} translate-y-[.5rem] min-w-fit right-0`}
      >
        {AllConditionSigns &&
          AllConditionSigns?.map((c) => (
            <PlotfieldIfSingsPrompt
              key={c}
              signName={c}
              setShowSignModal={setShowSignModal}
              plotfieldCommandId={plotfieldCommandId}
              ifVariationId={ifVariationId}
              type={type}
            />
          ))}
      </AsideScrollable>
    </div>
  );
}
