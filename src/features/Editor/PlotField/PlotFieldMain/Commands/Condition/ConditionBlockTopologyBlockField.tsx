import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";
import useGetAllTopologyBlocksByEpisodeId from "../../../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import { useParams } from "react-router-dom";
import useGetTopologyBlockById from "../../../hooks/TopologyBlock/useGetTopologyBlockById";
import useConditionBlocks from "./Context/ConditionContext";
import useUpdateConditionBlockTopologyBlockId from "../../../hooks/Condition/ConditionBlock/useUpdateConditionBlockTopologyBlockId";

type ConditionBlockTopologyBlockFieldTpyes = {
  targetBlockId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  topologyBlockName: string;
  currentTopologyBlockId: string;
  isElse: boolean;
};

export default function ConditionBlockTopologyBlockField({
  conditionBlockId,
  currentTopologyBlockId,
  plotfieldCommandId,
  targetBlockId,
  topologyBlockName,
  isElse,
}: ConditionBlockTopologyBlockFieldTpyes) {
  const { episodeId } = useParams();
  const { updateConditionBlockTargetBlockId } = useConditionBlocks();
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId: targetBlockId,
  });
  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);

  useEffect(() => {
    if (topologyBlock) {
      updateConditionBlockTargetBlockId({
        conditionBlockId,
        plotfieldCommandId,
        targetBlockId,
        topologyBlockName: topologyBlock?.name || "",
      });
    }
  }, [topologyBlock]);

  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId || "",
  });

  const updateTopologyBlock = useUpdateConditionBlockTopologyBlockId({
    conditionBlockId: conditionBlockId,
    sourceBlockId: targetBlockId,
    episodeId: episodeId || "",
  });

  useOutOfModal({
    setShowModal: setShowAllTopologyBlocks,
    showModal: showAllTopologyBlocks,
    modalRef,
  });
  return (
    <div
      className={`${
        isElse ? "relative self-end flex-grow" : "relative w-full flex justify-between flex-wrap gap-[1rem]"
      }`}
    >
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllTopologyBlocks((prev) => !prev);
        }}
        className={`${isElse ? "py-[1rem]" : ""}`}
        type="button"
      >
        {topologyBlockName ? `Ветка - ${topologyBlockName}` : "Текущая Ветка"}
      </PlotfieldButton>
      <AsideScrollable ref={modalRef} className={`${showAllTopologyBlocks ? "" : "hidden"} translate-y-[3.5rem]`}>
        {(allTopologyBlocks?.length || 0) > 1 ? (
          allTopologyBlocks?.map((tb) => (
            <AsideScrollableButton
              key={tb._id}
              type="button"
              onClick={() => {
                setShowAllTopologyBlocks(false);
                updateConditionBlockTargetBlockId({
                  conditionBlockId,
                  plotfieldCommandId,
                  targetBlockId: tb._id,
                  topologyBlockName: tb?.name || "",
                });
                updateTopologyBlock.mutate({ targetBlockId: tb._id });
              }}
              className={`${currentTopologyBlockId === tb._id ? "hidden" : ""} ${
                tb._id === targetBlockId ? "hidden" : ""
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
