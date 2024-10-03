import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../types/StoryData/Character/CharacterTypes";
import PlotfieldEmotionsPrompt from "./PlotfieldEmotionsPrompt";

type PlotfieldEmotionPromptMainTypes = {
  setEmotionName: React.Dispatch<React.SetStateAction<string>>;
  setEmotionId: React.Dispatch<React.SetStateAction<string>>;
  setShowEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionImg?: React.Dispatch<React.SetStateAction<string>>;
  showEmotionModal: boolean;
  allEmotions: EmotionsTypes[] | undefined;
  emotionName: string;
  modalPosition?: "right-0" | "left-0";
};

export default function PlotfieldEmotionPromptMain({
  setEmotionName,
  setEmotionId,
  setEmotionImg,
  setShowEmotionModal,
  showEmotionModal,
  allEmotions,
  emotionName,
  modalPosition,
}: PlotfieldEmotionPromptMainTypes) {
  const emotionsRef = useRef<HTMLDivElement>(null);
  useOutOfModal({
    modalRef: emotionsRef,
    setShowModal: setShowEmotionModal,
    showModal: showEmotionModal,
  });
  return (
    <aside
      ref={emotionsRef}
      className={`${showEmotionModal ? "" : "hidden"} translate-y-[.5rem] ${
        modalPosition ? modalPosition : "right-0"
      } absolute z-[10] p-[1rem] min-w-fit w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
    >
      {allEmotions?.length ? (
        allEmotions?.map((c) => (
          <PlotfieldEmotionsPrompt
            key={c._id}
            setEmotionName={setEmotionName}
            setEmotionId={setEmotionId}
            setEmotionImg={setEmotionImg}
            setShowEmotionModal={setShowEmotionModal}
            {...c}
          />
        ))
      ) : !allEmotions?.length && !emotionName?.trim().length ? (
        <button
          type="button"
          onClick={() => {
            setShowEmotionModal(false);
          }}
          className="whitespace-nowrap w-full flex-wrap text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
        >
          Пусто
        </button>
      ) : null}
    </aside>
  );
}
