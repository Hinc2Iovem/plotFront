import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import {
  AllConditionSigns,
  ConditionValueVariationType,
} from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import { PlotfieldConditionSingsPrompt } from "../../ConditionValueItem";
import useConditionBlocks from "../../Context/ConditionContext";
import AsideScrollable from "../../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import PlotfieldButton from "../../../../../../../../ui/Buttons/PlotfieldButton";

type ConditionSignFieldTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionBlockVariationId: string;
  type: ConditionValueVariationType;
};

export default function ConditionSignField({
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
  type,
}: ConditionSignFieldTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { getConditionBlockVariationById } = useConditionBlocks();

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
        {getConditionBlockVariationById({ conditionBlockId, plotfieldCommandId, conditionBlockVariationId })?.sign
          ? getConditionBlockVariationById({ conditionBlockId, plotfieldCommandId, conditionBlockVariationId })?.sign
          : "Знак"}
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
