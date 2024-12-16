import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../../../hooks/UI/useOutOfModal";
import { generateMongoObjectId } from "../../../../../../../../../utils/generateMongoObjectId";
import usePlotfieldCommands from "../../../../../../Context/PlotFieldContext";
import useCreateCharacterBlank from "../../../../../../hooks/Character/useCreateCharacterBlank";
import useUpdateNameOrEmotionOnCondition from "../../../../../../hooks/Say/useUpdateNameOrEmotionOnCondition";
import { CharacterValueTypes } from "../CommandSayCharacterFieldItem";

type CommandSayCreateCharacterFieldTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterValue: React.Dispatch<React.SetStateAction<CharacterValueTypes>>;
  showModal: boolean;
  characterName: string;
  plotFieldCommandId: string;
  commandSayId: string;
  characterId: string;
};

export default function CommandSayCreateCharacterFieldModal({
  setShowModal,
  setCharacterValue,
  showModal,
  characterName,
  commandSayId,
  plotFieldCommandId,
  characterId,
}: CommandSayCreateCharacterFieldTypes) {
  const queryClient = useQueryClient();
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLButtonElement | null>(null);
  const { updateEmotionProperties } = usePlotfieldCommands();

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

  const createNewCharacterOptimistic = (newCharacterId: string) => {
    if (newCharacterId?.trim().length) {
      updateNameOrEmotion.mutate({
        characterEmotionId: "",
        characterId: newCharacterId,
        plotFieldCommandSayId: commandSayId,
      });

      setCharacterValue((prev) => ({
        _id: newCharacterId,
        characterName: prev.characterName,
        imgUrl: null,
      }));

      updateEmotionProperties({
        id: plotFieldCommandId,
        emotionId: "",
        emotionName: "",
        emotionImg: "",
      });
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCharId = generateMongoObjectId();
    createNewCharacterOptimistic(newCharId);

    queryClient.invalidateQueries({
      queryKey: ["character", characterId],
    });
    queryClient.invalidateQueries({
      queryKey: ["translation", "russian", "character", characterId],
    });

    createCharacter.mutate({ characterId: newCharId });
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
