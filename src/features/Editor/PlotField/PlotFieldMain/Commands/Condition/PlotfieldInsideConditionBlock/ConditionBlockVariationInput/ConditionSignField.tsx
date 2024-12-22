import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import {
  AllConditionSigns,
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { PlotfieldConditionSingsPrompt } from "../../ConditionBlockItem/ConditionValueItem";
import AsideScrollable from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import PlotfieldButton from "../../../../../../../../ui/Buttons/PlotfieldButton";

type ConditionSignFieldTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionBlockVariationId: string;
  type: ConditionValueVariationType;
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
  currentSign: ConditionSignTypes;
};

export default function ConditionSignField({
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
  type,
  currentSign,
  setCurrentSign,
}: ConditionSignFieldTypes) {
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
        className="bg-primary-darker h-full"
      >
        {currentSign || "Знак"}
      </PlotfieldButton>
      <AsideScrollable
        ref={modalRef}
        className={` ${showSignModal ? "" : "hidden"} translate-y-[.5rem] min-w-fit right-0`}
      >
        {AllConditionSigns &&
          AllConditionSigns?.map((c) => (
            <PlotfieldConditionSingsPrompt
              key={c}
              signName={c}
              setCurrentSign={setCurrentSign}
              setShowSignModal={setShowSignModal}
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              conditionBlockVariationId={conditionBlockVariationId}
              type={type}
            />
          ))}
      </AsideScrollable>
    </div>
  );
}
