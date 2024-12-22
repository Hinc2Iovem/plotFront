import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import {
  AllConditionSigns,
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import { PlotfieldIfSingsPrompt } from "./IfVariationsField";

type IfSignFieldTypes = {
  plotfieldCommandId: string;
  ifVariationId: string;
  type: ConditionValueVariationType;
  currentSign: ConditionSignTypes;
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
};

export default function IfSignField({
  plotfieldCommandId,
  ifVariationId,
  type,
  currentSign,
  setCurrentSign,
}: IfSignFieldTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

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
        {currentSign || "Знак"}
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
              setCurrentSign={setCurrentSign}
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
