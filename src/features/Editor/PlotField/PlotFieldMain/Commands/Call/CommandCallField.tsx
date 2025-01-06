import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldButton from "../../../../../../ui/Buttons/PlotfieldButton";
import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useSearch from "../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useGetCommandCall from "../../../hooks/Call/useGetCommandCall";
import useUpdateCallCommandIndex from "../../../hooks/Call/useUpdateCallCommandIndex";
import useUpdateCallText from "../../../hooks/Call/useUpdateCallText";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetAllTopologyBlocksByEpisodeId from "../../../hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import useGetTopologyBlockById from "../../../hooks/TopologyBlock/useGetTopologyBlockById";

type CommandCallFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
  command: string;
};

export default function CommandCallField({ plotFieldCommandId, topologyBlockId, command }: CommandCallFieldTypes) {
  const [nameValue] = useState<string>(command ?? "Call");

  const { data: commandCall } = useGetCommandCall({
    plotFieldCommandId,
    topologyBlockId,
  });

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const [commandCallId, setCommandCallId] = useState("");
  const [targetBlockId, setTargetBlockId] = useState("");
  const [currentTopologyBlockName, setCurrentTopologyBlockName] = useState("");
  const [currentReferencedCommandIndex, setCurrentReferencedCommandIndex] = useState<number | null>(null);

  const { data: currentTopologyBlock } = useGetTopologyBlockById({
    topologyBlockId: targetBlockId,
  });

  useAddItemInsideSearch({
    commandName: nameValue || "call",
    id: plotFieldCommandId,
    text: "",
    topologyBlockId,
    type: "command",
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
        typeof commandCall.referencedCommandIndex === "number" ? commandCall.referencedCommandIndex : null
      );
    }
  }, [commandCall]);

  return (
    <div className="flex flex-wrap gap-[.5rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused
              ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
              : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <div className="flex gap-[.5rem] sm:w-fit w-full flex-grow">
        <ChooseReferencedCommandIndex
          setCurrentReferencedCommandIndex={setCurrentReferencedCommandIndex}
          currentReferencedCommandIndex={currentReferencedCommandIndex}
          amountOfCommands={currentTopologyBlock?.topologyBlockInfo.amountOfCommands || 0}
          callId={commandCallId}
          plotFieldCommandId={plotFieldCommandId}
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
  plotFieldCommandId: string;
  amountOfCommands: number;
  currentReferencedCommandIndex: number | null;
  setCurrentReferencedCommandIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

function ChooseReferencedCommandIndex({
  callId,
  amountOfCommands,
  currentReferencedCommandIndex,
  plotFieldCommandId,
  setCurrentReferencedCommandIndex,
}: ChooseReferencedCommandIndexTypes) {
  const { episodeId } = useParams();
  const { updateValue } = useSearch();

  const updateCommandIndex = useUpdateCallCommandIndex({ callId });
  const modalRef = useRef<HTMLDivElement>(null);
  const [showAllCommandIndexes, setShowAllCommandIndexes] = useState(false);

  const updateValues = (index: number) => {
    if (typeof index === "number" && episodeId) {
      updateValue({
        episodeId,
        commandName: "call",
        id: plotFieldCommandId,
        type: "command",
        value: `${index}`,
      });
    }
  };

  useOutOfModal({
    modalRef,
    setShowModal: setShowAllCommandIndexes,
    showModal: showAllCommandIndexes,
  });

  return (
    <div className="relative">
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllCommandIndexes((prev) => !prev);
        }}
      >
        {typeof currentReferencedCommandIndex === "number"
          ? `Ссылаться на команду - ${currentReferencedCommandIndex}`
          : "Ссылаться на команду"}
      </PlotfieldButton>
      <AsideScrollable ref={modalRef} className={`${showAllCommandIndexes ? "" : "hidden"} translate-y-[.5rem] `}>
        {(typeof currentReferencedCommandIndex === "number" && amountOfCommands > 1) ||
        (typeof currentReferencedCommandIndex !== "number" && amountOfCommands > 0) ? (
          [...Array.from({ length: amountOfCommands })]?.map((_, i) => {
            return (
              <AsideScrollableButton
                key={"command" + "-" + i}
                type="button"
                onClick={() => {
                  setShowAllCommandIndexes(false);
                  updateValues(i);
                  setCurrentReferencedCommandIndex(i);
                  updateCommandIndex.mutate({ commandIndex: i });
                }}
                className={`${currentReferencedCommandIndex === i ? "hidden" : ""} `}
              >
                {i}
              </AsideScrollableButton>
            );
          })
        ) : (
          <AsideScrollableButton
            type="button"
            onClick={() => {
              setShowAllCommandIndexes(false);
            }}
          >
            Пусто
          </AsideScrollableButton>
        )}
      </AsideScrollable>
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
  setCurrentReferencedCommandIndex: React.Dispatch<React.SetStateAction<number | null>>;
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
      <PlotfieldButton
        onClick={(e) => {
          e.stopPropagation();
          setShowAllTopologyBlocks((prev) => !prev);
        }}
      >
        {currentTopologyBlockName || "Блок"}
      </PlotfieldButton>
      <AsideScrollable ref={modalRef} className={`${showAllTopologyBlocks ? "" : "hidden"} translate-y-[.5rem]`}>
        {((allTopologyBlocks?.length || 0) > 1 && !targetBlockId) || (allTopologyBlocks?.length || 0) > 2 ? (
          allTopologyBlocks?.map((tb) => (
            <AsideScrollableButton
              key={tb._id}
              type="button"
              onClick={() => {
                setShowAllTopologyBlocks(false);
                setTargetBlockId(tb._id);
                setCurrentTopologyBlockName(tb?.name || "");
                setCurrentReferencedCommandIndex(0);
              }}
              className={`${topologyBlockId === tb._id ? "hidden" : ""} ${tb._id === targetBlockId ? "hidden" : ""} `}
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
