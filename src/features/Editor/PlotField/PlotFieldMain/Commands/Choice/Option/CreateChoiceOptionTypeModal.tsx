import { useRef } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import { ChoiceOptionVariations } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useCreateChoiceOption from "../../hooks/Choice/ChoiceOption/useCreateChoiceOption";

type CreateChoiceOptionTypeModalTypes = {
  plotFieldCommandId: string;
  plotFieldCommandChoiceId: string;
  topologyBlockId: string;
  showCreateChoiceOptionModal: boolean;
  setShowCreateChoiceOptionModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateChoiceOptionTypeModal({
  plotFieldCommandChoiceId,
  plotFieldCommandId,
  showCreateChoiceOptionModal,
  topologyBlockId,
  setShowCreateChoiceOptionModal,
}: CreateChoiceOptionTypeModalTypes) {
  const { episodeId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const createChoiceOption = useCreateChoiceOption({
    plotFieldCommandChoiceId,
    plotFieldCommandId,
    episodeId: episodeId || "",
    topologyBlockId,
  });

  useOutOfModal({
    modalRef,
    showModal: showCreateChoiceOptionModal,
    setShowModal: setShowCreateChoiceOptionModal,
  });
  return (
    <aside
      ref={modalRef}
      className={`${
        showCreateChoiceOptionModal ? "" : "hidden"
      } absolute right-0 z-[10] flex flex-col min-w-fit w-full rounded-md shadow-md p-[.5rem] bg-white`}
    >
      {ChoiceOptionVariations.map((cov) => (
        <button
          key={cov}
          onClick={() => {
            setShowCreateChoiceOptionModal(false);
            createChoiceOption.mutate({ type: cov });
          }}
          className={`hover:bg-primary-light-blue outline-gray-300 hover:text-white transition-all text-[1.4rem] whitespace-nowrap text-gray-700 px-[1rem] py-[.5rem] rounded-md`}
        >
          {cov}
        </button>
      ))}
    </aside>
  );
}
