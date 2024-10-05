import { useEffect, useRef, useState } from "react";
import useGetCommandCall from "../hooks/Call/useGetCommandCall";
import useUpdateCallText from "../hooks/Call/useUpdateCallText";
import useGetTopologyBlockById from "../hooks/TopologyBlock/useGetTopologyBlockById";
import useGetAllTopologyBlocksByEpisodeId from "../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import useUpdateCallCommandIndex from "../hooks/Call/useUpdateCallCommandIndex";

type CommandCallFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandCallField({
  plotFieldCommandId,
  topologyBlockId,
  command,
}: CommandCallFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Call");

  const { data: commandCall } = useGetCommandCall({
    plotFieldCommandId,
    topologyBlockId,
  });

  const [commandCallId, setCommandCallId] = useState("");
  const [targetBlockId, setTargetBlockId] = useState("");
  const [currentTopologyBlockName, setCurrentTopologyBlockName] = useState("");
  const [currentReferencedCommandIndex, setCurrentReferencedCommandIndex] =
    useState<number | null>(null);

  const { data: currentTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: targetBlockId,
  });

  useEffect(() => {
    if (currentTopologyBlock) {
      setCurrentTopologyBlockName(currentTopologyBlock?.name || "");
    }
  }, [currentTopologyBlock]);

  useEffect(() => {
    if (commandCall) {
      setCommandCallId(commandCall._id);
      setTargetBlockId(commandCall.targetBlockId);
      setCurrentReferencedCommandIndex(
        typeof commandCall.referencedCommandIndex === "number"
          ? commandCall.referencedCommandIndex
          : null
      );
    }
  }, [commandCall]);

  return (
    <div className="flex flex-wrap gap-[.5rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default">
          {nameValue}
        </h3>
      </div>
      <div className="flex gap-[.5rem] sm:w-fit w-full flex-grow">
        <ChooseReferencedCommandIndex
          setCurrentReferencedCommandIndex={setCurrentReferencedCommandIndex}
          currentReferencedCommandIndex={currentReferencedCommandIndex}
          amountOfCommands={
            currentTopologyBlock?.topologyBlockInfo.amountOfCommands || 0
          }
          callId={commandCallId}
        />
        <ChooseTopologyBlock
          callId={commandCallId}
          setCurrentReferencedCommandIndex={setCurrentReferencedCommandIndex}
          currentTopologyBlockName={currentTopologyBlockName}
          setCurrentTopologyBlockName={setCurrentTopologyBlockName}
          setTargetBlockId={setTargetBlockId}
          topologyBlockId={topologyBlockId}
          targetBlockId={targetBlockId}
          prevTargetBlockId={commandCall?.targetBlockId || ""}
        />
      </div>
    </div>
  );
}

type ChooseReferencedCommandIndexTypes = {
  callId: string;
  amountOfCommands: number;
  currentReferencedCommandIndex: number | null;
  setCurrentReferencedCommandIndex: React.Dispatch<
    React.SetStateAction<number | null>
  >;
};

function ChooseReferencedCommandIndex({
  callId,
  amountOfCommands,
  currentReferencedCommandIndex,
  setCurrentReferencedCommandIndex,
}: ChooseReferencedCommandIndexTypes) {
  const updateCommandIndex = useUpdateCallCommandIndex({ callId });
  const modalRef = useRef<HTMLDivElement>(null);

  const [showAllCommandIndexes, setShowAllCommandIndexes] = useState(false);
  useOutOfModal({
    modalRef,
    setShowModal: setShowAllCommandIndexes,
    showModal: showAllCommandIndexes,
  });

  return (
    <div className="relative">
      <button
        className="text-[1.3rem] outline-gray-300 bg-white rounded-md shadow-md text-gray-700 px-[1rem] py-[.5rem]"
        onClick={(e) => {
          e.stopPropagation();
          setShowAllCommandIndexes((prev) => !prev);
        }}
      >
        {typeof currentReferencedCommandIndex === "number"
          ? currentReferencedCommandIndex
          : "Ссылаться на команду"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllCommandIndexes ? "" : "hidden"
        } z-[10] left-0 flex flex-col gap-[1rem] p-[.5rem] max-h-[15rem] overflow-y-auto absolute min-w-fit w-full rounded-md shadow-md bg-white right-[0rem] translate-y-[.5rem] | containerScroll`}
      >
        {(typeof currentReferencedCommandIndex === "number" &&
          amountOfCommands > 1) ||
        (typeof currentReferencedCommandIndex !== "number" &&
          amountOfCommands > 0) ? (
          [...Array.from({ length: amountOfCommands })]?.map((_, i) => {
            return (
              <button
                key={"command" + "-" + i}
                type="button"
                onClick={() => {
                  setShowAllCommandIndexes(false);
                  setCurrentReferencedCommandIndex(i);
                  updateCommandIndex.mutate({ commandIndex: i });
                }}
                className={`${
                  currentReferencedCommandIndex === i ? "hidden" : ""
                } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 text-gray-700 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md`}
              >
                {i}
              </button>
            );
          })
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowAllCommandIndexes(false);
            }}
            className={`px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 text-gray-700 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md`}
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}

type ChooseTopologyBlockTypes = {
  callId: string;
  targetBlockId: string;
  prevTargetBlockId: string;
  currentTopologyBlockName: string;
  setCurrentTopologyBlockName: React.Dispatch<React.SetStateAction<string>>;
  setTargetBlockId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentReferencedCommandIndex: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  topologyBlockId: string;
};

function ChooseTopologyBlock({
  callId,
  currentTopologyBlockName,
  setCurrentTopologyBlockName,
  setTargetBlockId,
  setCurrentReferencedCommandIndex,
  topologyBlockId,
  targetBlockId,
  prevTargetBlockId,
}: ChooseTopologyBlockTypes) {
  const { episodeId } = useParams();

  const modalRef = useRef<HTMLDivElement>(null);
  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId || "",
  });

  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);

  useOutOfModal({
    modalRef,
    setShowModal: setShowAllTopologyBlocks,
    showModal: showAllTopologyBlocks,
  });

  const updateCallText = useUpdateCallText({
    callId,
    sourceBlockId: topologyBlockId,
    targetBlockId,
    episodeId: episodeId || "",
  });

  useEffect(() => {
    if (prevTargetBlockId !== targetBlockId && targetBlockId?.trim().length) {
      updateCallText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetBlockId]);

  return (
    <div className="relative flex-grow">
      <button
        className="text-[1.3rem] h-full outline-gray-300 w-full bg-white rounded-md shadow-md text-gray-700 px-[1rem] py-[.5rem]"
        onClick={(e) => {
          e.stopPropagation();
          setShowAllTopologyBlocks((prev) => !prev);
        }}
      >
        {currentTopologyBlockName || "Блок"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showAllTopologyBlocks ? "" : "hidden"
        } z-[10] flex flex-col gap-[1rem] p-[.5rem] max-h-[15rem] overflow-y-auto absolute min-w-fit w-full rounded-md shadow-md bg-white right-[0rem] translate-y-[.5rem] | containerScroll`}
      >
        {((allTopologyBlocks?.length || 0) > 1 && !targetBlockId) ||
        (allTopologyBlocks?.length || 0) > 2 ? (
          allTopologyBlocks?.map((tb) => (
            <button
              key={tb._id}
              type="button"
              onClick={() => {
                setShowAllTopologyBlocks(false);
                setTargetBlockId(tb._id);
                setCurrentTopologyBlockName(tb?.name || "");
                setCurrentReferencedCommandIndex(0);
              }}
              className={`${topologyBlockId === tb._id ? "hidden" : ""} ${
                tb._id === targetBlockId ? "hidden" : ""
              } px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 text-gray-700 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md`}
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
            className={`px-[1rem] py-[.5rem] whitespace-nowrap text-[1.3rem] outline-gray-300 text-gray-700 hover:bg-primary-light-blue hover:text-white shadow-md transition-all rounded-md`}
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}
