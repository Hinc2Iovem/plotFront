import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useCreateCharacterBlank from "../hooks/Character/useCreateCharacterBlank";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateWardrobeCurrentDressedAndCharacterId from "../hooks/Wardrobe/useUpdateWardrobeCurrentDressedAndCharacterId";

type CommandSayCreateCharacterFieldTypes = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  characterName: string;
  commandWardrobeId: string;
};

export default function CommandWardrobeCreateCharacter({
  setShowModal,
  showModal,
  characterName,
  commandWardrobeId,
}: CommandSayCreateCharacterFieldTypes) {
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
    storyId: storyId ?? "",
  });

  const updateCommandWardrobeCharacter =
    useUpdateWardrobeCurrentDressedAndCharacterId({
      commandWardrobeId,
    });

  useEffect(() => {
    if (characterId?.trim().length) {
      updateCommandWardrobeCharacter.mutate({
        characterId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  useEffect(() => {
    if (createCharacter.data) {
      setCharacterId(createCharacter.data._id);
    }
  }, [createCharacter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCharacter.mutate({ characterId });
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
      } translate-y-[3.3rem] z-10 shadow-md text-text-light w-full rounded-md absolute p-[1rem]`}
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
