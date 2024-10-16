import { useEffect, useRef, useState } from "react";
import useCreateEmotion from "../../../../../../../../../hooks/Posting/Emotion/useCreateEmotion";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../../types/StoryData/Character/CharacterTypes";
import useUpdateNameOrEmotion from "../../../../hooks/Say/useUpdateNameOrEmotion";

type CommandSayCreateEmotionFieldModalTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  emotionName: EmotionsTypes | null;
  characterId: string;
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
};

export default function CommandSayCreateEmotionFieldModal({
  setShowModal,
  showModal,
  emotionName,
  characterId,
  plotFieldCommandId,
  plotFieldCommandSayId,
}: CommandSayCreateEmotionFieldModalTypes) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLButtonElement | null>(null);
  const [newEmotionId, setNewEmotionId] = useState("");

  useEffect(() => {
    if (showModal) {
      cursorRef.current?.focus();
    }
  }, [showModal]);

  const createEmotion = useCreateEmotion({
    emotionName: emotionName?.emotionName || "",
    characterId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmotion.mutate();
    setShowModal(false);
  };

  useEffect(() => {
    if (createEmotion.status === "success") {
      console.log("happened?");
      const lastEmotion = createEmotion.data.emotions.length;
      setNewEmotionId(createEmotion.data.emotions[lastEmotion - 1]._id || "");
    }
  }, [createEmotion]);

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    characterEmotionId: newEmotionId,
    plotFieldCommandId,
    plotFieldCommandSayId,
    characterId,
  });

  useEffect(() => {
    if (newEmotionId?.trim().length) {
      updateNameOrEmotion.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newEmotionId]);

  useOutOfModal({
    setShowModal,
    showModal,
    modalRef,
  });
  return (
    <aside
      ref={modalRef}
      className={`bg-secondary ${
        showModal ? "" : "hidden"
      } translate-y-[7rem] z-10 shadow-md text-text-light w-full rounded-md absolute p-[1rem]`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[.5rem]">
        <p className="text-[1.4rem]">Такой эмоции не существует</p>
        <button
          ref={cursorRef}
          className="w-fit self-end text-[1.5rem] border-[1px] border-dotted border-black rounded-md px-[1rem] focus:shadow-inner active:bg-black shadow-sm shadow-gray-200"
        >
          Создать
        </button>
      </form>
    </aside>
  );
}
