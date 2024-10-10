import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { AllSexualOrientations } from "../../../../../../../types/StoryEditor/PlotField/Choice/SEXUAL_ORIENTATION_TYPES";
import useUpdateChoiceOptionSexualOrientation from "../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionSexualOrientation";
import "./OptionRaibowBtnStyles.css";

type OptionSelectSexualOrientationBlockTypes = {
  sexualOrientation: string;
  choiceOptionId: string;
  showAllSexualOrientationBlocks: boolean;
  setShowAllSexualOrientationBlocks: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setShowAllTopologyBlocks: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OptionSelectSexualOrientationBlock({
  sexualOrientation,
  choiceOptionId,
  setShowAllSexualOrientationBlocks,
  setShowAllTopologyBlocks,
  showAllSexualOrientationBlocks,
}: OptionSelectSexualOrientationBlockTypes) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [
    currentSexualOrientationBlockName,
    setCurrentSexualOrientationBlockName,
  ] = useState(sexualOrientation || "combined");

  useEffect(() => {
    if (sexualOrientation) {
      setCurrentSexualOrientationBlockName(sexualOrientation);
    }
  }, [sexualOrientation]);

  const updateOptionSexualOrientationBlock =
    useUpdateChoiceOptionSexualOrientation({
      choiceOptionId,
    });

  useOutOfModal({
    setShowModal: setShowAllSexualOrientationBlocks,
    showModal: showAllSexualOrientationBlocks,
    modalRef,
  });

  return (
    <div
      onMouseLeave={() => {
        setShowAllSexualOrientationBlocks(false);
      }}
      className="relative w-fit translate-y-[2.5rem] hover:translate-y-[0] transition-all z-[10]"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAllTopologyBlocks(false);
          setShowAllSexualOrientationBlocks((prev) => !prev);
        }}
        className="text-[1.3rem] text-white outline-gray-300 shadow-md rounded-md px-[1rem] py-[.5rem] | rainbowBtn"
        type="button"
      >
        {currentSexualOrientationBlockName || "Orientation"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllSexualOrientationBlocks ? "" : "hidden"
        } left-0 z-[10] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit w-full rounded-md shadow-md bg-white right-[0rem]`}
      >
        {AllSexualOrientations?.map((so) => (
          <button
            key={so}
            type="button"
            onClick={() => {
              setShowAllSexualOrientationBlocks(false);
              setCurrentSexualOrientationBlockName(so);
              updateOptionSexualOrientationBlock.mutate({
                sexualOrientationType: so,
              });
            }}
            className={`${
              currentSexualOrientationBlockName === so ? "hidden" : ""
            } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 text-gray-700 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md | rainbowBtn`}
          >
            {so}
          </button>
        ))}
      </aside>
    </div>
  );
}
