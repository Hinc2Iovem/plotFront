import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import useCreateEmotion from "../../../../../../../../../hooks/Posting/Emotion/useCreateEmotion";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import usePlotfieldCommands from "../../../../../../Context/PlotFieldContext";
import useUpdateNameOrEmotion from "../../../../../../hooks/Say/patch/useUpdateNameOrEmotion";
import { EmotionTypes } from "../CommandSayCharacterFieldItem";
import { generateMongoObjectId } from "../../../../../../../../../utils/generateMongoObjectId";

type CommandSayCreateEmotionFieldModalTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  emotionName: string;
  characterId: string;
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionTypes>>;
};

export default function CommandSayCreateEmotionFieldModal({
  setShowModal,
  showModal,
  emotionName,
  characterId,
  plotFieldCommandId,
  plotFieldCommandSayId,
  setEmotionValue,
}: CommandSayCreateEmotionFieldModalTypes) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();
  const [newEmotionId, setNewEmotionId] = useState("");
  const { updateEmotionProperties } = usePlotfieldCommands();

  useEffect(() => {
    if (showModal) {
      cursorRef.current?.focus();
    }
  }, [showModal]);

  const createEmotion = useCreateEmotion({
    emotionName: emotionName || "",
    characterId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emotionId = generateMongoObjectId();
    setNewEmotionId(emotionId);
    updateOptimisticState(emotionId);
    setShowModal(false);
    await Promise.all([updateNameOrEmotion.mutateAsync({}), createEmotion.mutateAsync({ emotionId })]).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["character", characterId],
      });
    });
  };

  const updateOptimisticState = (emotionId: string) => {
    setEmotionValue((prev) => ({
      _id: emotionId,
      emotionName: prev.emotionName,
      imgUrl: null,
    }));

    updateEmotionProperties({
      emotionId: emotionId,
      emotionImg: "",
      emotionName: emotionName || "",
      id: plotFieldCommandId,
    });
  };

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    characterEmotionId: newEmotionId,
    plotFieldCommandId,
    plotFieldCommandSayId,
    characterId,
  });

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
