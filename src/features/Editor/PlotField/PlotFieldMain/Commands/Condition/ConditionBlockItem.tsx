import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateConditionBlockTopologyBlockId from "../hooks/Condition/ConditionBlock/useUpdateConditionBlockTopologyBlockId";
import useGetAllTopologyBlocksByEpisodeId from "../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../hooks/TopologyBlock/useGetTopologyBlockById";
import ConditionValueItem from "./ConditionValueItem";
import useConditionBlocks, {
  ConditionBlockItemTypes,
} from "./Context/ConditionContext";
import DisplayOrderOfIfsModal from "./DisplayOrderOfIfsModal";
import ConditionBlockShowPlot from "./ConditionBlockShowPlot";
import AsideScrollable from "../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../shared/Buttons/PlotfieldButton";

type ConditionBlockItemProps = {
  currentTopologyBlockId: string;
  conditionId: string;
  plotfieldCommandId: string;
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
} & ConditionBlockItemTypes;

export default function ConditionBlockItem({
  setShowConditionBlockPlot,
  conditionBlockId,
  targetBlockId,
  isElse,
  orderOfExecution,
  currentTopologyBlockId,
  conditionId,
  topologyBlockName,
  plotfieldCommandId,
  conditionName,
  conditionValue,
  sign,
  conditionType,
}: ConditionBlockItemProps) {
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
    episodeId: episodeId ?? "",
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
    <>
      {!isElse ? (
        <div
          className={`p-[1rem] flex flex-col gap-[1rem] justify-around w-full bg-secondary rounded-md shadow-md`}
        >
          <div className="flex flex-col gap-[1rem] ">
            <ConditionValueItem
              key={conditionBlockId}
              conditionBlockId={conditionBlockId}
              name={conditionName}
              sign={sign}
              value={conditionValue}
              conditionType={conditionType}
              plotfieldCommandId={plotfieldCommandId}
            />
          </div>
          <div className="flex flex-col gap-[1rem]">
            <ConditionBlockShowPlot
              conditionBlockId={conditionBlockId}
              plotfieldCommandId={plotfieldCommandId}
              setShowConditionBlockPlot={setShowConditionBlockPlot}
              targetBlockId={targetBlockId}
            />
            <DisplayOrderOfIfsModal
              conditionBlockId={conditionBlockId}
              commandConditionId={conditionId}
              currentOrder={orderOfExecution}
              plotfieldCommandId={plotfieldCommandId}
            />
            <div className="relative w-full flex justify-between flex-wrap gap-[1rem]">
              <PlotfieldButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTopologyBlocks((prev) => !prev);
                }}
                type="button"
              >
                {topologyBlockName || "Текущая Ветка"}
              </PlotfieldButton>
              <AsideScrollable
                className={`${
                  showAllTopologyBlocks ? "" : "hidden"
                } translate-y-[3.5rem]`}
              >
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
                      className={`${
                        currentTopologyBlockId === tb._id ? "hidden" : ""
                      } ${tb._id === targetBlockId ? "hidden" : ""}`}
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
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-wrap gap-[.5rem] flex-grow bg-secondary rounded-md shadow-md px-[.5rem] py-[.5rem]`}
        >
          <ConditionBlockShowPlot
            conditionBlockId={conditionBlockId}
            plotfieldCommandId={plotfieldCommandId}
            setShowConditionBlockPlot={setShowConditionBlockPlot}
            targetBlockId={targetBlockId}
          />
          <div className="relative self-end flex-grow">
            <PlotfieldButton
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTopologyBlocks((prev) => !prev);
              }}
              type="button"
            >
              {topologyBlockName || "Текущая Ветка"}
            </PlotfieldButton>
            <AsideScrollable
              ref={modalRef}
              className={`${
                showAllTopologyBlocks ? "" : "hidden"
              } translate-y-[3.5rem]`}
            >
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
                    className={`${
                      currentTopologyBlockId === tb._id ? "hidden" : ""
                    } ${tb._id === targetBlockId ? "hidden" : ""}`}
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
        </div>
      )}
    </>
  );
}
