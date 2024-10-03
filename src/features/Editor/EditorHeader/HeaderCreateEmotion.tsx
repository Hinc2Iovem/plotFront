import { useEffect, useRef, useState } from "react";
import CharacterPrompt from "../../Profile/Translator/InputPrompts/CharacterPrompt/CharacterPrompt";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import useCreateEmotion from "../../../hooks/Posting/Emotion/useCreateEmotion";

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
      } flex flex-col p-[1rem] gap-[1rem] mx-auto w-[30rem] rounded-md shadow-md bg-white`}
    >
      <CharacterPrompt
        characterId={characterId}
        setCharacterId={setCharacterId}
        storyId={storyId}
        currentLanguage="russian"
      />
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[1rem]">
        <input
          type="text"
          value={emotionName}
          placeholder="Эмоция"
          onChange={(e) => setEmotionName(e.target.value)}
          className="w-full px-[1rem] py-[.5rem] border-[2px] border-gray-300 border-dashed text-[1.4rem] text-gray-700 outline-gray-300 rounded-md"
        />
        <button className="text-[1.4rem] outline-gray-300 border-gray-200 border-dashed border-[2px] text-gray-500 hover:text-black hover:border-gray-400 hover:scale-[1.01] transition-all px-[1rem] py-[.5rem] w-fit ml-auto rounded-md">
          Создать
        </button>
      </form>
    </div>
  );
}
