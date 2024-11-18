import { useEffect, useRef, useState } from "react";
import CharacterPrompt from "../../Profile/Translator/InputPrompts/CharacterPrompt/CharacterPrompt";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import useCreateEmotion from "../../../hooks/Posting/Emotion/useCreateEmotion";
import PlotfieldInput from "../../shared/Inputs/PlotfieldInput";

type HeaderCreateEmotionTypes = {
  storyId: string;
  setShowCreateEmotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateEmotionModal: boolean;
};

export default function HeaderCreateEmotion({
  storyId,
  setShowCreateEmotionModal,
  showCreateEmotionModal,
}: HeaderCreateEmotionTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [emotionName, setEmotionName] = useState("");
  const [characterId, setCharacterId] = useState("");

  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCreateEmotionModal,
    showModal: showCreateEmotionModal,
  });

  const createEmotion = useCreateEmotion({ characterId, emotionName });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotionName?.trim().length) {
      console.log("Заполните Поле");
      return;
    }
    createEmotion.mutate();
    setShowCreateEmotionModal(false);
  };

  useEffect(() => {
    setEmotionName("");
    setCharacterId("");
  }, [showCreateEmotionModal]);
  return (
    <div
      ref={modalRef}
      className={`${
        showCreateEmotionModal ? "" : "hidden"
      } flex flex-col p-[1rem] gap-[1rem] mx-auto w-[30rem] rounded-md shadow-md bg-secondary`}
    >
      <CharacterPrompt
        characterId={characterId}
        setCharacterId={setCharacterId}
        storyId={storyId}
        currentLanguage="russian"
      />
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[1rem]">
        <PlotfieldInput
          type="text"
          value={emotionName}
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          placeholder="Эмоция"
          onChange={(e) => setEmotionName(e.target.value)}
        />
        <button className="text-[1.4rem] outline-gray-300 border-gray-200 border-dashed border-[2px] text-text-dark hover:text-text-light focus-within:text-text-light hover:border-gray-400 hover:scale-[1.01] transition-all px-[1rem] py-[.5rem] w-fit ml-auto rounded-md">
          Создать
        </button>
      </form>
    </div>
  );
}
