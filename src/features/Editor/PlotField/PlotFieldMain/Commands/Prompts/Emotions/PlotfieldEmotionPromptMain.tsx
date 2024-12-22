import { useRef } from "react";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../types/StoryData/Character/CharacterTypes";
import PlotfieldEmotionsPrompt from "./PlotfieldEmotionsPrompt";

export type EmotionValueTypes = {
  emotionId: string | null;
  emotionName: string | null;
  emotionImg: string | null;
};

type PlotfieldEmotionPromptMainTypes = {
  setShowEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionValueTypes>>;
  emotionValue: EmotionValueTypes;
  showEmotionModal: boolean;
  allEmotions: EmotionsTypes[] | undefined;
  modalPosition?: "right-0" | "left-0";
};

export default function PlotfieldEmotionPromptMain({
  setShowEmotionModal,
  showEmotionModal,
  allEmotions,
  modalPosition,
  emotionValue,
  setEmotionValue,
}: PlotfieldEmotionPromptMainTypes) {
  const emotionsRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
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
      } absolute z-[10] p-[1rem] min-w-fit w-full max-h-[10rem] overflow-y-auto bg-secondary shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
    >
      {allEmotions?.length ? (
        allEmotions?.map((c) => (
          <PlotfieldEmotionsPrompt
            key={c._id}
            setEmotionValue={setEmotionValue}
            setShowEmotionModal={setShowEmotionModal}
            {...c}
          />
        ))
      ) : !allEmotions?.length && !emotionValue.emotionName?.trim().length ? (
        <button
          type="button"
          onClick={() => {
            setShowEmotionModal(false);
          }}
          className={`whitespace-nowrap ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } w-full flex-wrap text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-darker hover:text-text-light text-text-dark focus-within:text-text-light focus-within:bg-primary-darker transition-all rounded-md`}
        >
          Пусто
        </button>
      ) : null}
    </aside>
  );
}
