import { useEffect, useRef, useState } from "react";
import { ChoiceVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { useParams } from "react-router-dom";
import useGetAllTopologyBlocksByEpisodeId from "../../../../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../../../../hooks/TopologyBlock/useGetTopologyBlockById";
import useUpdateChoice from "../../../../hooks/Choice/useUpdateChoice";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";

type ChoiceMultipleBlockTypes = {
  choiceId: string;
  exitBlockId: string;
  setShowChoiceMultipleModal: React.Dispatch<React.SetStateAction<boolean>>;
  showChoiceMultipleModal: boolean;
  setShowChoiceVariationTypesModal: React.Dispatch<React.SetStateAction<boolean>>;
  choiceVariationTypes: ChoiceVariationsTypes;
  setExitBlockId: React.Dispatch<React.SetStateAction<string>>;
};

export default function ChoiceMultipleBlock({
  choiceId,
  exitBlockId,
  setShowChoiceMultipleModal,
  showChoiceMultipleModal,
  setShowChoiceVariationTypesModal,
  choiceVariationTypes,
  setExitBlockId,
}: ChoiceMultipleBlockTypes) {
  const { episodeId } = useParams();
  const choiceVariationMultipleRef = useRef<HTMLDivElement>(null);
  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId ?? "",
  });
  const { data: currentTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: exitBlockId,
  });
  const [currentTopologyBlockName, setCurrentTopologyBlockName] = useState("");
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (currentTopologyBlock) {
      setCurrentTopologyBlockName(currentTopologyBlock.name || "");
    }
  }, [currentTopologyBlock]);

  const updateChoice = useUpdateChoice({ choiceId });

  useOutOfModal({
    modalRef: choiceVariationMultipleRef,
    setShowModal: setShowChoiceMultipleModal,
    showModal: showChoiceMultipleModal,
  });

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowChoiceVariationTypesModal(false);
          setShowChoiceMultipleModal((prev) => !prev);
        }}
        className={`${
          choiceVariationTypes === "multiple" ? "" : "hidden"
        } text-start w-full text-[1.3rem] px-[1rem] text-text-light py-[.5rem] rounded-md ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        }`}
      >
        {currentTopologyBlockName?.trim().length ? currentTopologyBlockName : "Повторная Ветка"}
      </button>
      <aside
        ref={choiceVariationMultipleRef}
        className={`${
          showChoiceMultipleModal ? "" : "hidden"
        } translate-y-[.5rem] absolute z-[100] flex flex-col gap-[1rem] bg-primary-darker rounded-md shadow-md w-full min-w-fit p-[.5rem]`}
      >
        {(exitBlockId && (allTopologyBlocks?.length || 0) > 1) || (!exitBlockId && allTopologyBlocks?.length) ? (
          allTopologyBlocks?.map((atb) => (
            <button
              key={atb._id}
              className={`${atb._id === exitBlockId ? "hidden" : ""} text-start ${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } whitespace-nowrap text-[1.3rem] rounded-md hover:scale-[1.01] shadow-md bg-secondary hover:bg-primary-darker hover:text-text-light text-text-dark focus-within:text-text-light focus-within:bg-primary-darker px-[1rem] py-[.5rem]`}
              onClick={() => {
                setExitBlockId(atb._id);
                setShowChoiceVariationTypesModal(false);
                setShowChoiceMultipleModal(false);
                updateChoice.mutate({
                  choiceType: choiceVariationTypes || "multiple",
                  exitBlockId: atb._id,
                });
              }}
            >
              {atb.name}
            </button>
          ))
        ) : (
          <button
            className={`text-start outline-gray-300 text-[1.3rem] rounded-md hover:scale-[1.01] shadow-md bg-secondary  px-[1rem] py-[.5rem]`}
            onClick={() => {
              setShowChoiceVariationTypesModal(false);
              setShowChoiceMultipleModal(false);
            }}
          >
            Пусто
          </button>
        )}
      </aside>
    </>
  );
}
