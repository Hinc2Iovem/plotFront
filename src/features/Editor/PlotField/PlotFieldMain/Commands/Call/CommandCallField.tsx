import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { SelectContent } from "@radix-ui/react-select";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { episodeId } = useParams();
  const { updateValue } = useSearch();

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

  const updateValues = ({ blockName, index }: { index?: number; blockName?: string }) => {
    //TODO update value on backend
    const currentIndex = typeof index === "number" ? index : currentReferencedCommandIndex;
    const currentBlockName = typeof blockName === "string" ? blockName : currentTopologyBlockName;
    if (typeof index === "number" && episodeId) {
      updateValue({
        episodeId,
        commandName: "call",
        id: plotFieldCommandId,
        type: "command",
        value: `${currentBlockName} ${currentIndex}`,
      });
    }
  };

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
    <div className="flex flex-wrap gap-[5px] w-full border-border border-[1px] rounded-md p-[5px] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[100px] relative">
        <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
          {nameValue}
        </PlotfieldCommandNameField>
      </div>
      <div className="flex gap-[5px] flex-grow">
        <ChooseTopologyBlock
          callId={commandCallId}
          onChange={(value) => updateValues({ blockName: value })}
          setCurrentReferencedCommandIndex={setCurrentReferencedCommandIndex}
          currentTopologyBlockName={currentTopologyBlockName}
          setCurrentTopologyBlockName={setCurrentTopologyBlockName}
          setTargetBlockId={setTargetBlockId}
          topologyBlockId={topologyBlockId}
          targetBlockId={targetBlockId}
          prevTargetBlockId={commandCall?.targetBlockId || ""}
        />

        <ChooseReferencedCommandIndex
          onSelect={(value) => updateValues({ index: value })}
          setCurrentReferencedCommandIndex={setCurrentReferencedCommandIndex}
          currentReferencedCommandIndex={currentReferencedCommandIndex}
          amountOfCommands={currentTopologyBlock?.topologyBlockInfo.amountOfCommands || 0}
          callId={commandCallId}
        />
      </div>
    </div>
  );
}

type ChooseReferencedCommandIndexTypes = {
  callId: string;
  amountOfCommands: number;
  currentReferencedCommandIndex: number | null;
  onSelect: (value: number) => void;
  setCurrentReferencedCommandIndex: React.Dispatch<React.SetStateAction<number | null>>;
};

function ChooseReferencedCommandIndex({
  callId,
  amountOfCommands,
  currentReferencedCommandIndex,
  onSelect,
  setCurrentReferencedCommandIndex,
}: ChooseReferencedCommandIndexTypes) {
  const updateCommandIndex = useUpdateCallCommandIndex({ callId });

  return (
    <SelectWithBlur onValueChange={(value) => onSelect(+value)}>
      <SelectTrigger disabled={amountOfCommands <= 0} className="text-text w-[200px] opacity-80 relative">
        <SelectValue
          placeholder={
            typeof currentReferencedCommandIndex === "number"
              ? `Ссылаться на команду - ${currentReferencedCommandIndex}`
              : "Ссылаться на команду"
          }
          onBlur={(v) => v.currentTarget.blur()}
          className={`capitalize text-text text-[17px] py-[5px] px-[1px]`}
        />
      </SelectTrigger>
      <SelectContent className="w-full">
        {(typeof currentReferencedCommandIndex === "number" && amountOfCommands > 1) ||
        (typeof currentReferencedCommandIndex !== "number" && amountOfCommands > 0)
          ? [...Array.from({ length: amountOfCommands })]?.map((_, i) => {
              return (
                <SelectItem
                  key={"command" + "-" + i}
                  value={`${i}`}
                  onSelect={() => {
                    setCurrentReferencedCommandIndex(i);
                    updateCommandIndex.mutate({ commandIndex: i });
                  }}
                  className={`${currentReferencedCommandIndex === i ? "hidden" : ""} text-text`}
                >
                  {i}
                </SelectItem>
              );
            })
          : null}
      </SelectContent>
    </SelectWithBlur>
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
  onChange: (value: string) => void;
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
  onChange,
}: ChooseTopologyBlockTypes) {
  const { episodeId } = useParams();
  const currentInput = useRef<HTMLInputElement>(null);
  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);

  const { data: allTopologyBlocks } = useGetAllTopologyBlocksByEpisodeId({
    episodeId: episodeId || "",
  });

  const updateCallText = useUpdateCallText({
    callId,
    sourceBlockId: topologyBlockId,
    targetBlockId,
    episodeId: episodeId || "",
  });

  const updateTopologyBlockNameOnBlur = () => {
    if (prevTargetBlockId !== targetBlockId && targetBlockId?.trim().length) {
      updateCallText.mutate();
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: allTopologyBlocks?.length || 0 });

  return (
    <Popover open={showAllTopologyBlocks} onOpenChange={setShowAllTopologyBlocks}>
      <PopoverTrigger asChild>
        <form className="flex-grow flex justify-between items-center relative">
          <PlotfieldInput
            ref={currentInput}
            value={currentTopologyBlockName || ""}
            onChange={(e) => {
              setShowAllTopologyBlocks(true);
              setCurrentTopologyBlockName(e.target.value);
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            onBlur={updateTopologyBlockNameOnBlur}
            className={`w-full text-text md:text-[17px]`}
            placeholder="Блок"
          />
        </form>
      </PopoverTrigger>

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {((allTopologyBlocks?.length || 0) > 1 && !targetBlockId) || (allTopologyBlocks?.length || 0) > 2 ? (
          allTopologyBlocks?.map((tb, i) => (
            <Button
              key={tb._id}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                setShowAllTopologyBlocks(false);
                setTargetBlockId(tb._id);
                setCurrentTopologyBlockName(tb?.name || "");
                setCurrentReferencedCommandIndex(0);
              }}
              className={`${topologyBlockId === tb._id ? "hidden" : ""} ${
                tb._id === targetBlockId ? "hidden" : ""
              } whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all text-[16px]`}
            >
              {tb.name}
            </Button>
          ))
        ) : (
          <Button
            type="button"
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
