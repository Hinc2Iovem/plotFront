import { useEffect, useRef } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateSoundText from "../hooks/Sound/useUpdateSoundText";

type CreateSoundFieldTypes = {
  storyId: string;
  commandSoundId: string;
  soundName: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateSoundField({
  storyId,
  commandSoundId,
  showModal,
  setShowModal,
  soundName,
}: CreateSoundFieldTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showModal) {
      cursorRef.current?.focus();
    }
  }, [showModal]);

  const updateSoundText = useUpdateSoundText({
    storyId: storyId ?? "",
    commandSoundId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSoundText.mutate({ soundName: soundName });
    setShowModal(false);
  };

  useOutOfModal({
    modalRef,
    setShowModal,
    showModal,
  });
  return (
    <aside
      ref={modalRef}
      className={`bg-white ${
        showModal ? "" : "hidden"
      } translate-y-[3.3rem] z-10 shadow-md text-gray-600 w-full rounded-md absolute p-[1rem]`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[.5rem]">
        <p className="text-[1.4rem]">Такого Звука не существует</p>
        <button
          ref={cursorRef}
          className="w-fit self-end text-[1.5rem] border-[1px] border-dotted border-black rounded-md px-[1rem] focus:shadow-inner active:bg-black shadow-md shadow-gray-200"
        >
          Создать
        </button>
      </form>
    </aside>
  );
}
