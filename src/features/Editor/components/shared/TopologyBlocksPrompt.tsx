import { useParams } from "react-router-dom";
import useGetAllTopologyBlocksByEpisodeId from "../../PlotField/hooks/TopologyBlock/useGetAllTopologyBlocksByEpisodeId";
import React, { useMemo, useRef, useState } from "react";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toastSuccessStyles } from "@/components/shared/toastStyles";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import useCreateTopologyBlock from "../../PlotField/hooks/TopologyBlock/useCreateTopologyBlock";
import useNavigation from "../../Context/Navigation/NavigationContext";

export type TopologyBlockValueTypes = {
  id: string;
  name: string;
};

type TopologyBlocksPromptTypes = {
  inputClasses?: string;
  currentlyFocusedBlockId?: string;
  topologyBlockName: string;
  initValue: TopologyBlockValueTypes;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  setTopologyBlockValue: React.Dispatch<React.SetStateAction<TopologyBlockValueTypes>>;
};

export default function TopologyBlocksPrompt({
  inputClasses,
  currentlyFocusedBlockId,
  topologyBlockName,
  initValue,
  setUpdate,
  setTopologyBlockValue,
}: TopologyBlocksPromptTypes) {
  // TODO dermo derma etot component
  const { episodeId } = useParams();
  const currentTopologyBlock = useNavigation((state) => state.currentTopologyBlock);
  const [showTopologyBlockModal, setShowTopologyBlockModal] = useState(false);
  const currentInput = useRef<HTMLInputElement>(null);

  const { data: topologyBlocks } = useGetAllTopologyBlocksByEpisodeId({ episodeId: episodeId || "" });

  const allTopologyBlocksWithoutCurrentBlock = useMemo(() => {
    if (topologyBlocks) {
      return topologyBlocks.filter((t) => t._id !== currentTopologyBlock._id);
    } else {
      return [];
    }
  }, [topologyBlocks, currentTopologyBlock._id]);

  const filteredTopologyBlocks = useMemo(() => {
    if (allTopologyBlocksWithoutCurrentBlock) {
      if (topologyBlockName?.trim().length) {
        return allTopologyBlocksWithoutCurrentBlock
          .filter((cc) => cc?.name?.toLowerCase().includes(topologyBlockName?.trim()?.toLowerCase()))
          .filter((t) => t._id !== currentlyFocusedBlockId);
      } else {
        return allTopologyBlocksWithoutCurrentBlock.filter((t) => t._id !== currentlyFocusedBlockId);
      }
    } else {
      return [];
    }
  }, [allTopologyBlocksWithoutCurrentBlock, topologyBlockName, currentlyFocusedBlockId]);

  const createNewTopologyBlock = useCreateTopologyBlock({ episodeId: episodeId || "" });

  const handleUpdatingTopologyBlockState = async ({ create, mm }: { mm?: string; create: boolean }) => {
    const value = mm?.trim().length ? mm.trim().toLowerCase() : topologyBlockName?.trim()?.toLowerCase();

    if (!value?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initValue?.name?.trim().toLowerCase() === value) {
      return;
    }

    const foundTopologyBlock = allTopologyBlocksWithoutCurrentBlock?.find(
      (s) => s?.name?.trim().toLowerCase() === value.trim().toLowerCase()
    );

    console.log("foundTopologyBlock: ", foundTopologyBlock);

    if (value.trim().length) {
      if (!foundTopologyBlock?._id) {
        if (showTopologyBlockModal) {
          if (create) {
            toast(`Блок был создан`, toastSuccessStyles);
            const topologyBlockId = generateMongoObjectId();
            await createNewTopologyBlock.mutateAsync({});
            setTopologyBlockValue({
              name: value,
              id: topologyBlockId,
            });
            setUpdate(true);
            return;
          }
          // when onBlur and jumping to a modal
          return;
        }
      } else {
        // just updated topologyBlock command
        setTopologyBlockValue({
          name: foundTopologyBlock.name || value,
          id: foundTopologyBlock._id,
        });
        setUpdate(true);
      }
    }
  };

  const handleSelect = (index: number) => {
    const selectedValue = filteredTopologyBlocks[index];

    if (selectedValue) {
      setTopologyBlockValue({
        id: selectedValue._id,
        name: selectedValue.name || "",
      });
      setShowTopologyBlockModal(false);
      handleUpdatingTopologyBlockState({ mm: selectedValue.name || "", create: false });
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: filteredTopologyBlocks.length, onSelect: handleSelect });

  return (
    <Popover open={showTopologyBlockModal} onOpenChange={setShowTopologyBlockModal}>
      <PopoverTrigger asChild>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (filteredTopologyBlocks.length) {
              handleUpdatingTopologyBlockState({ mm: topologyBlockName, create: false });
            }
          }}
          className="flex-grow flex justify-between items-center relative"
        >
          <PlotfieldInput
            ref={currentInput}
            value={topologyBlockName}
            onChange={(e) => {
              setShowTopologyBlockModal(true);
              setTopologyBlockValue((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
            onBlur={() => handleUpdatingTopologyBlockState({ create: false })}
            className={`${inputClasses ? inputClasses : "w-full text-text md:text-[17px]"}`}
            placeholder="Топологический Блок"
          />
        </form>
      </PopoverTrigger>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {filteredTopologyBlocks?.length ? (
          filteredTopologyBlocks?.map((c, i) => {
            return (
              <Button
                key={`${c._id}-${i}`}
                ref={(el) => (buttonsRef.current[i] = el)}
                type="button"
                onClick={() => {
                  setTopologyBlockValue({
                    id: c._id,
                    name: c.name || "",
                  });
                  handleUpdatingTopologyBlockState({ create: false, mm: c.name });
                  setShowTopologyBlockModal(false);
                }}
                className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
              >
                {(c?.name || "").length > 20 ? c?.name?.substring(0, 20) + "..." : c.name}
              </Button>
            );
          })
        ) : !filteredTopologyBlocks?.length ? (
          <Button
            type="button"
            onClick={() => {
              setShowTopologyBlockModal(false);
              handleUpdatingTopologyBlockState({ create: true });
            }}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            {topologyBlockName.trim().length && !currentlyFocusedBlockId?.trim().length ? "Создать" : "Пусто"}
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
