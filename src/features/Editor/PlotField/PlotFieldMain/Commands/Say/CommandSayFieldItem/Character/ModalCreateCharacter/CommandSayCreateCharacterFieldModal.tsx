import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../../types/StoryData/Character/CharacterTypes";
import { generateMongoObjectId } from "../../../../../../../../../utils/generateMongoObjectId";
import useCreateCharacterBlank from "../../../../hooks/Character/useCreateCharacterBlank";
import useUpdateNameOrEmotionOnCondition from "../../../../hooks/Say/useUpdateNameOrEmotionOnCondition";
import { useQueryClient } from "@tanstack/react-query";

type CommandSayCreateCharacterFieldTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewlyCreated: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionsTypes | null>>;
  setNewlyCreatedName: React.Dispatch<React.SetStateAction<string>>;
  showModal: boolean;
  characterName: string;
  plotFieldCommandId: string;
  currentCharacterId: string;
  commandSayId: string;
};

export default function CommandSayCreateCharacterFieldModal({
  setShowModal,
  setCurrentCharacterId,
  setNewlyCreatedName,
  showModal,
  characterName,
  currentCharacterId,
  commandSayId,
  setEmotionValue,
  setNewlyCreated,
}: CommandSayCreateCharacterFieldTypes) {
  const queryClient = useQueryClient();
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLButtonElement | null>(null);
  const [characterId, setCharacterId] = useState("");

  useEffect(() => {
    if (showModal) {
      cursorRef.current?.focus();
    }
  }, [showModal]);

  const createCharacter = useCreateCharacterBlank({
    characterType: "minorcharacter",
    name: characterName,
    storyId: storyId || "",
  });

  const updateNameOrEmotion = useUpdateNameOrEmotionOnCondition();

  useEffect(() => {
    if (characterId?.trim().length) {
      updateNameOrEmotion.mutate({
        characterEmotionId: "",
        characterId,
        plotFieldCommandSayId: commandSayId,
      });
      setEmotionValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCharacterId = generateMongoObjectId();

    setNewlyCreated(true);
    queryClient.invalidateQueries({
      queryKey: ["character", currentCharacterId],
    });
    queryClient.invalidateQueries({
      queryKey: ["translation", "russian", "character", characterId],
    });
    setCharacterId(newCharacterId);
    setCurrentCharacterId(newCharacterId);
    setNewlyCreatedName(characterName);

    createCharacter.mutate({ characterId: newCharacterId });
    setShowModal(false);
  };

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
      } translate-y-[4rem] z-10 shadow-md text-text-light w-full rounded-md absolute p-[1rem]`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[.5rem]">
        <p className="text-[1.4rem]">Такого персонажа не существует</p>
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
