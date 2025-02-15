import { toastNotificationStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useMemo, useState } from "react";
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

    if (localSoundName === soundName) {
      return;
    }

    const foundSound = allSoundMemoized?.find((s) => s.soundName.trim().toLowerCase() === value.trim().toLowerCase());

    if (onChange) {
      onChange(value);
    }

    if (!foundSound) {
      toast("Создать Звук", {
        ...toastNotificationStyles,
        className: "flex text-[18px] text-white justify-between items-center",
        action: <SoundActionButton commandSoundId={commandSoundId} soundName={value} setSoundName={setSoundName} />,
      });
    } else {
      // just updated sound command
      setSoundName(value);
      updateSoundText.mutate({ commandSoundId, soundId: foundSound.id });
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: allSoundFilteredMemoized.length });

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
            onBlur={() => handleUpdatingSoundState({})}
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
              onClick={() => {
                setLocalSoundName(mm);
                handleUpdatingSoundState({ mm: mm });
                setShowSoundModal(false);
              }}
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
