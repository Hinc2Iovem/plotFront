import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import useCreateCharacteristic from "../../../hooks/Posting/Characteristic/useCreateCharacteristic";

type HeaderCreateCharacteristicTypes = {
  storyId: string;
  setShowCreateCharacteristicModal: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showCreateCharacteristicModal: boolean;
};

export default function HeaderCreateCharacteristic({
  storyId,
  setShowCreateCharacteristicModal,
  showCreateCharacteristicModal,
}: HeaderCreateCharacteristicTypes) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [characteristicName, setCharacteristicName] = useState("");

  useOutOfModal({
    modalRef,
    setShowModal: setShowCreateCharacteristicModal,
    showModal: showCreateCharacteristicModal,
  });

  const createCharacteristic = useCreateCharacteristic({
    characteristicName,
    storyId,
    language: "russian",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characteristicName?.trim().length) {
      console.log("Заполните Поле");
      return;
    }
    createCharacteristic.mutate();
    setShowCreateCharacteristicModal(false);
  };

  useEffect(() => {
    setCharacteristicName("");
  }, [showCreateCharacteristicModal]);

  return (
    <div
      ref={modalRef}
      className={`${
        showCreateCharacteristicModal ? "" : "hidden"
      } flex flex-col p-[1rem] gap-[1rem] mx-auto w-[30rem] rounded-md shadow-md bg-white`}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-[1rem]">
        <input
          type="text"
          value={characteristicName}
          placeholder="Характеристика"
          onChange={(e) => setCharacteristicName(e.target.value)}
          className="w-full px-[1rem] py-[.5rem] border-[2px] border-gray-300 border-dashed text-[1.4rem] text-gray-700 outline-gray-300 rounded-md"
        />
        <button className="text-[1.4rem] outline-gray-300 border-gray-200 border-dashed border-[2px] text-gray-500 hover:text-black hover:border-gray-400 hover:scale-[1.01] transition-all px-[1rem] py-[.5rem] w-fit ml-auto rounded-md">
          Создать
        </button>
      </form>
    </div>
  );
}
