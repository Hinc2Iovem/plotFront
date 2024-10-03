import { useRef, useState } from "react";
import useCreateEmotion from "../../../hooks/Posting/Emotion/useCreateEmotion";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";

type EmotionHeaderCreateEmotionTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  characterId: string;
};

export default function EmotionHeaderCreateEmotion({
  characterId,
  setShowCharacterModal,
  setShowModal,
  showModal,
}: EmotionHeaderCreateEmotionTypes) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useOutOfModal({ modalRef, setShowModal, showModal });

  const [emotionName, setEmotionName] = useState("");
  const createEmotion = useCreateEmotion({ characterId, emotionName });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotionName.trim().length) {
      console.log("Заполните поле");
      return;
    }
    createEmotion.mutate();
    setShowModal(false);
  };

  return (
    <div className={`flex flex-col gap-[1rem] relative w-fit`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
          setEmotionName("");
          setShowCharacterModal(false);
        }}
        className={`text-[1.5rem] px-[1rem] py-[.5rem] outline-gray-400 bg-white rounded-md shadow-md hover:bg-primary-pastel-blue hover:text-white transition-all active:scale-[0.98]`}
      >
        Создать Эмоцию
      </button>
      <aside
        ref={modalRef}
        className={`${
          showModal ? "" : "hidden"
        } translate-y-[2.3rem] absolute top-1/2 z-[10] p-[1rem] min-w-[10rem] w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem]`}
      >
        <form className="flex flex-col gap-[1rem]" onSubmit={handleSubmit}>
          <input
            type="text"
            value={emotionName}
            placeholder="Смайл"
            className="w-full px-[1rem] py-[.5rem] rounded-md text-[1.4rem] outline-none text-gray-700 border-[1px] border-dashed border-gray-500"
            onChange={(e) => setEmotionName(e.target.value)}
          />
          <button className="w-fit self-end text-[1.3rem] px-[1rem] py-[.5rem] shadow-md rounded-md hover:bg-primary-light-blue hover:text-white transition-all">
            Создать
          </button>
        </form>
      </aside>
    </div>
  );
}
