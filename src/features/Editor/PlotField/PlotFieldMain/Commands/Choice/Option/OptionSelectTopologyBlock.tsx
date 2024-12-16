import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../../../ui/Buttons/PlotfieldButton";
import useUpdateChoiceOptionTopologyBlock from "../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTopologyBlock";
import useGetAllTopologyBlocksByEpisodeId from "../../../../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../../../../hooks/TopologyBlock/useGetTopologyBlockById";
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
  const [currentTopologyBlockName, setCurrentTopologyBlockName] = useState(topologyBlockName || "");
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
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllTopologyBlocks((prev) => !prev);
          setShowAllOrders(false);
        }}
        type="button"
      >
        {currentTopologyBlockName || "Текущая Ветка"}
      </PlotfieldButton>
      <AsideScrollable
        ref={modalRef}
        className={`${
          showAllTopologyBlocks ? "" : "hidden"
        } min-w-fit w-full translate-y-[.5rem] whitespace-nowrap right-0`}
      >
        {(topologyBlockId && (allTopologyBlocks?.length || 0) > 1) ||
        (!topologyBlockId && allTopologyBlocks?.length) ? (
          allTopologyBlocks?.map((tb) => (
            <AsideScrollableButton
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
              }`}
            >
              {tb.name}
            </AsideScrollableButton>
          ))
        ) : (
          <AsideScrollableButton
            type="button"
            onClick={() => {
              setShowAllTopologyBlocks(false);
            }}
          >
            Пусто
          </AsideScrollableButton>
        )}
      </AsideScrollable>
    </div>
  );
}
