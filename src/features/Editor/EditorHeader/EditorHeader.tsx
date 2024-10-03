import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import commands from "../../../assets/images/Editor/commands.png";
import characteristic from "../../../assets/images/Story/characteristic.png";
import emotion from "../../../assets/images/Story/emotion.png";
import stats from "../../../assets/images/shared/stats.png";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import ButtonHoverPromptModal from "../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import HeaderCreateEmotion from "./HeaderCreateEmotion";
import HeaderCreateCharacteristic from "./HeaderCreateCharacteristic";

type EditorHeaderTypes = {
  setShowHeader: React.Dispatch<React.SetStateAction<boolean>>;
  showHeader: boolean;
};

export default function EditorHeader({
  setShowHeader,
  showHeader,
}: EditorHeaderTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const [showCreateEmotionModal, setShowCreateEmotionModal] = useState(false);
  const [showCreateCharacteristicModal, setShowCreateCharacteristicModal] =
    useState(false);

  useOutOfModal({
    modalRef,
    setShowModal: setShowHeader,
    showModal: showHeader,
  });

  return (
    <header
      ref={modalRef}
      className={`flex flex-col py-[1rem] left-0 w-full shadow-sm gap-[1rem] px-[1rem] bg-white fixed z-[1000] transition-transform duration-300 ${
        showHeader ? "translate-y-[-1rem]" : "-translate-y-[200%]"
      }`}
    >
      <div className="flex w-full items-center gap-[1rem] justify-between">
        <button className="bg-white rounded-md px-[1rem] hover:scale-[1.01] hover:shadow-md py-[.5rem] transition-all">
          <Link className="text-[2.5rem]" to={`/stories/${storyId}`}>
            Назад к Истории
          </Link>
        </button>
        <div className="flex gap-[1rem] w-fit z-[10]">
          <div className="flex gap-[.5rem] bg-yellow-100 rounded-md p-[.5rem] py-[.2rem] items-center shadow-md">
            <ButtonHoverPromptModal
              contentName="Лист Команд"
              positionByAbscissa="right"
              asideClasses="text-[1.5rem]"
            >
              <img src={commands} alt="Commands" className="w-[4rem]" />
            </ButtonHoverPromptModal>
            <ButtonHoverPromptModal
              contentName="Информация по эпизоду"
              positionByAbscissa="right"
              asideClasses="text-[1.5rem]"
            >
              <img src={stats} alt="Episode Info" className="w-[4rem]" />
            </ButtonHoverPromptModal>
          </div>
          <div className="flex gap-[.5rem] bg-green-200 rounded-md p-[.5rem] py-[.2rem] items-center shadow-md">
            <ButtonHoverPromptModal
              contentName="Создать Эмоцию"
              positionByAbscissa="right"
              asideClasses="text-[1.5rem]"
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateCharacteristicModal(false);
                setShowCreateEmotionModal((prev) => !prev);
              }}
            >
              <img src={emotion} alt="Emotions" className="w-[4rem]" />
            </ButtonHoverPromptModal>
            <ButtonHoverPromptModal
              contentName="Создать Характеристику"
              positionByAbscissa="right"
              asideClasses="text-[1.5rem]"
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateEmotionModal(false);
                setShowCreateCharacteristicModal((prev) => !prev);
              }}
            >
              <img
                src={characteristic}
                alt="Characteristics"
                className="w-[4rem]"
              />
            </ButtonHoverPromptModal>
          </div>
        </div>
      </div>

      <HeaderCreateEmotion
        storyId={storyId || ""}
        showCreateEmotionModal={showCreateEmotionModal}
        setShowCreateEmotionModal={setShowCreateEmotionModal}
      />
      <HeaderCreateCharacteristic
        setShowCreateCharacteristicModal={setShowCreateCharacteristicModal}
        showCreateCharacteristicModal={showCreateCharacteristicModal}
        storyId={storyId || ""}
      />
    </header>
  );
}
