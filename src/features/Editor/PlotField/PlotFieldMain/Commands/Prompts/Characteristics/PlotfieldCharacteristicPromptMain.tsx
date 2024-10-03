import { useParams } from "react-router-dom";
import useGetAllCharacteristicsByStoryId from "../../../../../../../hooks/Fetching/Translation/Characteristic/useGetAllCharacteristicsByStoryId";
import PlotfieldCharacteristicsPrompt from "./PlotfieldCharacteristicsPrompt";
import "../promptStyles.css";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { useRef } from "react";

type PlotfieldCharacteristicPromptMainTypes = {
  setCharacteristicName: React.Dispatch<React.SetStateAction<string>>;
  setCharacteristicId: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacteristicModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacteristicModal: boolean;
};

export default function PlotfieldCharacteristicPromptMain({
  setCharacteristicName,
  setCharacteristicId,
  setShowCharacteristicModal,
  showCharacteristicModal,
}: PlotfieldCharacteristicPromptMainTypes) {
  const { storyId } = useParams();
  const { data: allCharacteristics } = useGetAllCharacteristicsByStoryId({
    storyId: storyId || "",
    language: "russian",
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacteristicModal,
    showModal: showCharacteristicModal,
  });
  return (
    <aside
      ref={modalRef}
      className={`${
        showCharacteristicModal ? "" : "hidden"
      } translate-y-[.5rem] right-0 absolute z-[20] p-[1rem] min-w-fit w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | scrollBar`}
    >
      {allCharacteristics?.length ? (
        allCharacteristics?.map((c) => (
          <PlotfieldCharacteristicsPrompt
            key={c._id}
            setCharacteristicName={setCharacteristicName}
            setCharacteristicId={setCharacteristicId}
            setShowCharacteristicModal={setShowCharacteristicModal}
            {...c}
          />
        ))
      ) : (
        <button
          type="button"
          onClick={() => {
            setShowCharacteristicModal(false);
          }}
          className="whitespace-nowrap w-full flex-wrap text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
        >
          Пусто
        </button>
      )}
    </aside>
  );
}
