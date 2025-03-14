import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useUpdateCommandSound from "../../../hooks/Sound/Command/useUpdateCommandSound";
import useGetAllSoundByStoryIdAndIsGlobal from "../../../hooks/Sound/useGetAllSoundsByStoryIdAndIsGlobal";
import SoundActionButton from "./SoundActionButton";

type AllSoundsModalTypes = {
  soundName: string;
  storyId: string;
  commandSoundId: string;
  onChange: (value: string) => void;
  setSoundName: React.Dispatch<React.SetStateAction<string>>;
};

const AllSoundsModal = ({ setSoundName, soundName, storyId, commandSoundId, onChange }: AllSoundsModalTypes) => {
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [localSoundName, setLocalSoundName] = useState(soundName || "");
  const { data: allSound } = useGetAllSoundByStoryIdAndIsGlobal({
    storyId: storyId || "",
  });

  useEffect(() => {
    if (!localSoundName.trim().length) {
      setLocalSoundName(soundName);
    }
  }, [soundName]);

  const allSoundFilteredMemoized = useMemo(() => {
    const res = [...(allSound || [])];
    if (localSoundName) {
      const filtered = res?.filter((a) => a.soundName?.toLowerCase().includes(localSoundName?.toLowerCase())) || [];
      return filtered.map((f) => f.soundName?.toLowerCase());
    } else {
      return res.map((r) => r.soundName?.toLowerCase());
    }
  }, [allSound, localSoundName]);

  const allSoundMemoized = useMemo(() => {
    return (
      allSound?.map((a) => ({
        soundName: a.soundName?.toLowerCase(),
        id: a._id,
      })) || []
    );
  }, [allSound]);

  const updateSoundText = useUpdateCommandSound();

  const handleUpdatingSoundState = async ({ mm }: { mm?: string }) => {
    const value = mm?.trim().length ? mm : localSoundName;

    if (!value?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (value === soundName) {
      return;
    }

    const foundSound = allSoundMemoized?.find((s) => s.soundName.trim().toLowerCase() === value.trim().toLowerCase());

    if (onChange) {
      onChange(value);
    }

    if (!foundSound) {
      toast("Создать Звук", {
        className: "flex text-[15px] text-white justify-between items-center",
        action: <SoundActionButton commandSoundId={commandSoundId} soundName={value} setSoundName={setSoundName} />,
      });
    } else {
      // just updated sound command
      setSoundName(value);
      updateSoundText.mutate({ commandSoundId, soundId: foundSound.id });
    }
  };

  const arrowDownPressedRef = useRef(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      arrowDownPressedRef.current = true;

      setTimeout(() => {
        arrowDownPressedRef.current = false;
      }, 100);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (index: number) => {
    const value = allSoundFilteredMemoized[index];
    if (value) {
      console.log("value: ", value);
      console.log("soundName: ", soundName);

      setLocalSoundName(value);
      handleUpdatingSoundState({ mm: value });
      setShowSoundModal(false);
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: allSoundFilteredMemoized.length, onSelect: handleSelect });

  return (
    <Popover open={showSoundModal} onOpenChange={setShowSoundModal}>
      <PopoverTrigger asChild>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full"
        >
          <PlotfieldInput
            value={localSoundName || ""}
            onChange={(e) => {
              setShowSoundModal(true);
              setLocalSoundName(e.target.value);
            }}
            onBlur={() => {
              if (!arrowDownPressedRef.current) {
                handleUpdatingSoundState({});
              }
            }}
            placeholder="Звук"
          />
        </form>
      </PopoverTrigger>

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {allSoundFilteredMemoized.length ? (
          allSoundFilteredMemoized.map((mm, i) => (
            <Button
              key={mm + i}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => handleSelect(i)}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {mm}
            </Button>
          ))
        ) : (
          <Button
            type="button"
            onClick={() => {
              handleUpdatingSoundState({ mm: soundName });
              setShowSoundModal(false);
            }}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AllSoundsModal;
