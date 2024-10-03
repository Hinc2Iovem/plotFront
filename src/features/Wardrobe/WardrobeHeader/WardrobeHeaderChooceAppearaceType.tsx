import { useRef } from "react";
import { BodyTypes } from "../../../const/APPEARACE_PARTS";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type WardrobeHeaderChooceAppearaceTypeProps = {
  setBodyType: React.Dispatch<
    React.SetStateAction<TranslationTextFieldNameAppearancePartsTypes>
  >;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBodyTypeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showBodyTypeModal: boolean;
  bodyType: TranslationTextFieldNameAppearancePartsTypes;
};

export default function WardrobeHeaderChooceAppearaceType({
  setShowCharacterModal,
  bodyType,
  setBodyType,
  setShowModal,
  setShowBodyTypeModal,
  showBodyTypeModal,
}: WardrobeHeaderChooceAppearaceTypeProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useOutOfModal({
    modalRef,
    setShowModal: setShowBodyTypeModal,
    showModal: showBodyTypeModal,
  });
  return (
    <div className="flex flex-col gap-[.5rem] relative ">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowCharacterModal(false);
          setShowModal(false);
          setShowBodyTypeModal(true);
        }}
        className="text-[1.5rem] px-[1rem] py-[.5rem] outline-gray-400 bg-white rounded-md shadow-md hover:bg-primary-pastel-blue hover:text-white transition-all active:scale-[0.98]"
      >
        Тип Одежды
      </button>
      <p className="text-[1.5rem] border-b-[2px] border-gray-700 border-dotted text-center rounded-md">
        {bodyType}
      </p>
      <aside
        id="scrollBar"
        ref={modalRef}
        className={`${
          showBodyTypeModal ? "" : "hidden"
        } absolute top-1/2 translate-y-[1rem] z-[10] p-[1rem] min-w-[10rem] w-full h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
      >
        {BodyTypes.map((bt) => (
          <button
            key={bt}
            onClick={() => {
              setBodyType(bt);
              setShowBodyTypeModal(false);
            }}
            className="text-[1.3rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
          >
            {bt}
          </button>
        ))}
      </aside>
    </div>
  );
}
