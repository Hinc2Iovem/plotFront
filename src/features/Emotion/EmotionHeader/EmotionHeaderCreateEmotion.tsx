import { useRef, useState } from "react";
import useCreateEmotion from "../../../hooks/Posting/Emotion/useCreateEmotion";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { generateMongoObjectId } from "../../../utils/generateMongoObjectId";

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
  const theme = localStorage.getItem("theme");
  useOutOfModal({ modalRef, setShowModal, showModal });

  const [emotionName, setEmotionName] = useState("");
  const createEmotion = useCreateEmotion({ characterId, emotionName });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emotionName.trim().length) {
      console.log("Заполните поле");
      return;
    }
    const emotionId = generateMongoObjectId();
    createEmotion.mutate({ emotionId });
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
        className={`text-[1.5rem] focus-within:text-text-light focus-within:bg-primary-darker text-text-dark hover:text-text-light px-[1rem] py-[.5rem] outline-gray-400 bg-secondary rounded-md shadow-md hover:bg-primary-darker transition-all active:scale-[0.98]`}
      >
        Создать Эмоцию
      </button>
      <aside
        ref={modalRef}
        className={`${
          showModal ? "" : "hidden"
        } translate-y-[2.3rem] absolute top-1/2 z-[10] p-[1rem] min-w-[10rem] w-full max-h-[10rem] overflow-y-auto bg-secondary shadow-md rounded-md flex flex-col gap-[1rem]`}
      >
        <form className="flex flex-col gap-[1rem]" onSubmit={handleSubmit}>
          <input
            type="text"
            value={emotionName}
            placeholder="Смайл"
            className="w-full px-[1rem] py-[.5rem] text-text-light rounded-md text-[1.4rem] outline-none border-[1px] border-dashed border-gray-500"
            onChange={(e) => setEmotionName(e.target.value)}
          />
          <button
            className={`w-fit text-text-dark ${
              theme === "light" ? "" : "bg-primary-darker opacity-90"
            } hover:text-text-light self-end text-[1.4rem] px-[1rem] py-[.5rem] shadow-md rounded-md hover:bg-primary-darker transition-all`}
          >
            Создать
          </button>
        </form>
      </aside>
    </div>
  );
}
