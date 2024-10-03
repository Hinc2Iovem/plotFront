import { useRef, useState } from "react";
import useCreateAppearancePart from "../../../hooks/Posting/AppearancePart/useCreateAppearancePart";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type WardrobeHeaderCreateAppearancePartTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBodyTypeModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  characterId: string;
  appearanceType: TranslationTextFieldNameAppearancePartsTypes;
};

export default function WardrobeHeaderCreateAppearancePart({
  setShowBodyTypeModal,
  setShowCharacterModal,
  setShowModal,
  showModal,
  characterId,
  appearanceType,
}: WardrobeHeaderCreateAppearancePartTypes) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useOutOfModal({ modalRef, setShowModal, showModal });

  const [appearancePartName, setAppearancePartName] = useState("");
  const createAppearancePart = useCreateAppearancePart({
    characterId,
    appearancePartName,
    appearanceType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appearancePartName.trim().length) {
      console.log("Заполните поле");
      return;
    }
    createAppearancePart.mutate();
    setShowModal(false);
  };

  return (
    <div className="flex flex-col gap-[.5rem] relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
          setAppearancePartName("");
          setShowCharacterModal(false);
          setShowBodyTypeModal(false);
        }}
        className={`text-[1.5rem] h-fit px-[1rem] py-[.5rem] outline-gray-400 bg-white rounded-md shadow-md hover:bg-primary-pastel-blue hover:text-white transition-all active:scale-[0.98]`}
      >
        Создать Одежду
      </button>
      <aside
        ref={modalRef}
        className={`${
          showModal ? "" : "hidden"
        } translate-y-[2rem] sm:translate-y-[1rem] absolute top-1/2 z-[10] p-[1rem] min-w-[10rem] w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem]`}
      >
        <form className="flex flex-col gap-[1rem]" onSubmit={handleSubmit}>
          <input
            type="text"
            value={appearancePartName}
            placeholder="Брюки"
            className="w-full px-[1rem] py-[.5rem] rounded-md text-[1.4rem] outline-none text-gray-700 border-[1px] border-dashed border-gray-500"
            onChange={(e) => setAppearancePartName(e.target.value)}
          />
          <button className="w-fit self-end text-[1.3rem] px-[1rem] py-[.5rem] shadow-md rounded-md hover:bg-primary-light-blue hover:text-white transition-all">
            Создать
          </button>
        </form>
      </aside>
    </div>
  );
}
