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
}: ConditionBlockItemProps) {
  const { episodeId } = useParams();
  const theme = localStorage.getItem("theme");
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
          className={`p-[1rem] flex flex-col gap-[1rem] w-full bg-secondary rounded-md shadow-md`}
        >
          <ConditionValueItem
            key={conditionBlockId}
            conditionBlockId={conditionBlockId}
            name={conditionName}
            sign={sign}
            value={conditionValue}
          />
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTopologyBlocks((prev) => !prev);
              }}
              className={`flex-grow text-[1.4rem] ${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } text-text-light shadow-md rounded-md px-[1rem] py-[.5rem]`}
              type="button"
            >
              {topologyBlockName || "Текущая Ветка"}
            </button>
            <aside
              className={`${
                showAllTopologyBlocks ? "" : "hidden"
              } z-[10] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit w-full rounded-md shadow-md bg-secondary right-[0rem] translate-y-[.5rem] overflow-y-auto max-h-[20rem] | containerScroll`}
            >
              {(allTopologyBlocks?.length || 0) > 1 ? (
                allTopologyBlocks?.map((tb) => (
                  <button
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
                    } ${
                      tb._id === targetBlockId ? "hidden" : ""
                    } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
                      theme === "light"
                        ? "outline-gray-300"
                        : "outline-gray-600"
                    } text-text-dark hover:bg-primary-light hover:text-text-light focus-within:bg-primary-darker focus-within:text-text-light shadow-md transition-all rounded-md`}
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
                  className={`px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
                    theme === "light" ? "outline-gray-300" : "outline-gray-600"
                  } text-text-dark hover:bg-primary-light hover:text-text-light focus-within:bg-primary-darker focus-within:text-text-light shadow-md transition-all rounded-md`}
                >
                  Пусто
                </button>
              )}
            </aside>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllTopologyBlocks((prev) => !prev);
              }}
              className={`w-full text-[1.4rem] ${
                theme === "light" ? "outline-gray-300" : "outline-gray-600"
              } text-text-light shadow-md rounded-md px-[1rem] py-[.5rem] focus-within:bg-primary-darker`}
              type="button"
            >
              {topologyBlockName || "Текущая Ветка"}
            </button>
            <aside
              ref={modalRef}
              className={`${
                showAllTopologyBlocks ? "" : "hidden"
              } z-[10] flex flex-col gap-[1rem] p-[.5rem] absolute min-w-fit w-full rounded-md shadow-md bg-secondary right-[0rem] translate-y-[.5rem] overflow-y-auto max-h-[20rem] | containerScroll`}
            >
              {(allTopologyBlocks?.length || 0) > 1 ? (
                allTopologyBlocks?.map((tb) => (
                  <button
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
                    } ${
                      tb._id === targetBlockId ? "hidden" : ""
                    } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
                      theme === "light"
                        ? "outline-gray-300"
                        : "outline-gray-600"
                    } text-text-dark hover:bg-primary-darker hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker shadow-md transition-all rounded-md`}
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
                  className={`px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] ${
                    theme === "light" ? "outline-gray-300" : "outline-gray-600"
                  } text-text-dark hover:bg-primary-darker hover:text-text-light focus-within:text-text-light focus-within:bg-primary-darker shadow-md transition-all rounded-md`}
                >
                  Пусто
                </button>
              )}
            </aside>
          </div>
        </div>
      )}
    </>
  );
}
