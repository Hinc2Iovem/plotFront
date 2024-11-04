import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { AllConditionSigns } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { PlotfieldConditionSingsPrompt } from "../../ConditionValueItem";
import useConditionBlocks from "../../Context/ConditionContext";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";

type ConditionSignFieldTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
};

export default function ConditionSignField({
  conditionBlockId,
  plotfieldCommandId,
}: ConditionSignFieldTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { getConditionBlockById } = useConditionBlocks();

  const [showSignModal, setShowSignModal] = useState(false);

  useOutOfModal({
    showModal: showSignModal,
    setShowModal: setShowSignModal,
    modalRef,
  });
  return (
    <div className="relative w-full">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowSignModal((prev) => !prev);
        }}
        type="button"
        className="hover:bg-primary-darker"
      >
        {getConditionBlockById({ conditionBlockId, plotfieldCommandId })?.sign
          ? getConditionBlockById({ conditionBlockId, plotfieldCommandId })
              ?.sign
          : "Знак"}
      </PlotfieldButton>
      <AsideScrollable
        ref={modalRef}
        className={` ${showSignModal ? "" : "hidden"} translate-y-[.5rem] `}
      >
        {AllConditionSigns &&
          AllConditionSigns?.map((c) => (
            <PlotfieldConditionSingsPrompt
              key={c}
              signName={c}
              setShowSignModal={setShowSignModal}
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
            />
          ))}
      </AsideScrollable>
    </div>
  );
}
