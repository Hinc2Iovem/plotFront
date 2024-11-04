import { useEffect, useRef } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateMusicText from "../../../hooks/Music/useUpdateMusicText";

type CreateMusicFieldTypes = {
  storyId: string;
  commandMusicId: string;
  musicName: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateMusicField({
  storyId,
  commandMusicId,
  showModal,
  setShowModal,
  musicName,
}: CreateMusicFieldTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showModal) {
      cursorRef.current?.focus();
    }
  }, [showModal]);

  const updateMusicText = useUpdateMusicText({
    storyId: storyId ?? "",
    commandMusicId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateMusicText.mutate({ musicName: musicName });
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
      className={`bg-secondary ${
        showModal ? "" : "hidden"
      } translate-y-[4rem] z-10 shadow-md text-text-light w-full rounded-md absolute p-[1rem] left-0`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-[.5rem]">
        <p className="text-[1.4rem]">Такой музыки не существует</p>
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
