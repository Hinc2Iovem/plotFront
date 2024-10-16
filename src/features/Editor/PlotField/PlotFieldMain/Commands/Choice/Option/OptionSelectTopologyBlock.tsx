import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import useUpdateChoiceOptionTopologyBlock from "../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTopologyBlock";
import useGetAllTopologyBlocksByEpisodeId from "../../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../../hooks/TopologyBlock/useGetTopologyBlockById";
import useChoiceOptions from "../Context/ChoiceContext";

type OptionSelecteTopologyBlockTypes = {
  setShowAllTopologyBlocks: React.Dispatch<React.SetStateAction<boolean>>;
  topologyBlockId: string;
  choiceOptionId: string;
  showAllTopologyBlocks: boolean;
  setShowAllOrders: React.Dispatch<React.SetStateAction<boolean>>;
  currentTopologyBlockId: string;
  choiceId: string;
  topologyBlockName: string;
};

export default function OptionSelectTopologyBlock({
  topologyBlockId,
  choiceOptionId,
  setShowAllTopologyBlocks,
  showAllTopologyBlocks,
  currentTopologyBlockId,
  setShowAllOrders,
  choiceId,
  topologyBlockName,
}: OptionSelecteTopologyBlockTypes) {
  const { updateChoiceOptionTopologyBlockId } = useChoiceOptions();
  const [currentTopologyBlockName, setCurrentTopologyBlockName] = useState(
    topologyBlockName || ""
  );
  const theme = localStorage.getItem("theme");
  const { episodeId } = useParams();
  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId,
    moreThanZeroLenShow: topologyBlockName?.length > 0,
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topologyBlock) {
      setCurrentTopologyBlockName(topologyBlock?.name || "");
    }
  }, [topologyBlock]);

  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId ?? "",
  });
  const updateOptionTopologyBlock = useUpdateChoiceOptionTopologyBlock({
    choiceOptionId,
    episodeId: episodeId || "",
  });

  useOutOfModal({
    modalRef,
    setShowModal: setShowAllTopologyBlocks,
    showModal: showAllTopologyBlocks,
  });

  return (
    <div className="relative self-end pr-[.2rem] pb-[.2rem] w-fit bg-secondary shadow-md">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowAllTopologyBlocks((prev) => !prev);
          setShowAllOrders(false);
        }}
        className={`text-[1.3rem] relative z-[10] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light focus-within:bg-primary-darker shadow-md rounded-md px-[1rem] py-[.5rem] whitespace-nowrap bg-secondary`}
        type="button"
      >
        {currentTopologyBlockName || "Текущая Ветка"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllTopologyBlocks ? "" : "hidden"
        } overflow-y-auto max-h-[15rem] z-[20] flex flex-col gap-[1rem] p-[.5rem] pt-[1rem] absolute min-w-fit w-full rounded-md shadow-md bg-secondary right-[0rem] translate-y-[.2rem] | containerScroll`}
      >
        {(topologyBlockId && (allTopologyBlocks?.length || 0) > 1) ||
        (!topologyBlockId && allTopologyBlocks?.length) ? (
          allTopologyBlocks?.map((tb) => (
            <button
              key={tb._id}
              type="button"
              onClick={() => {
                setShowAllTopologyBlocks(false);
                setCurrentTopologyBlockName(tb?.name || "");
                updateChoiceOptionTopologyBlockId({
                  choiceId,
                  choiceOptionId,
                  topologyBlockId: tb._id,
                  topologyBlockName: tb?.name || "",
                });
                updateOptionTopologyBlock.mutate({
                  targetBlockId: tb._id,
                  sourceBlockId: topologyBlockId,
                });
              }}
              className={`${topologyBlockId === tb._id ? "hidden" : ""} ${
                currentTopologyBlockId === tb._id ? "hidden" : ""
              } ${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] text-text-dark hover:bg-primary-darker hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker shadow-md transition-all rounded-md`}
            >
              {tb.name}
            </button>
          ))
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowAllTopologyBlocks(false);
            }}
            className={`${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] text-text-dark hover:bg-primary-darker hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker shadow-md transition-all rounded-md`}
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}
