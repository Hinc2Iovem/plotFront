import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useState } from "react";
import useGetAllSoundByStoryIdAndIsGlobal from "../../../hooks/Sound/useGetAllSoundsByStoryIdAndIsGlobal";
import useUpdateSoundText from "../../../hooks/Sound/useUpdateSoundText";

type AllSoundsModalTypes = {
  soundName: string;
  storyId: string;
  initValue: string;
  soundId: string;
  onChange: (value: string) => void;
  setSoundName: React.Dispatch<React.SetStateAction<string>>;
  setInitValue: React.Dispatch<React.SetStateAction<string>>;
  setShowCreateSoundModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const AllSoundsModal = ({
  setShowCreateSoundModal,
  setSoundName,
  soundId,
  initValue,
  soundName,
  storyId,
  setInitValue,
  onChange,
}: AllSoundsModalTypes) => {
  const [showSoundModal, setShowSoundModal] = useState(false);

  const { data: allSound } = useGetAllSoundByStoryIdAndIsGlobal({
    storyId: storyId || "",
  });

  const allSoundFilteredMemoized = useMemo(() => {
    const res = [...(allSound || [])];
    if (soundName) {
      const filtered = res?.filter((a) => a.soundName?.toLowerCase().includes(soundName?.toLowerCase())) || [];
      return filtered.map((f) => f.soundName?.toLowerCase());
    } else {
      return res.map((r) => r.soundName?.toLowerCase());
    }
  }, [allSound, soundName]);

  const allSoundMemoized = useMemo(() => {
    return allSound?.map((a) => a.soundName?.toLowerCase()) || [];
  }, [allSound]);

  const updateSoundText = useUpdateSoundText({
    storyId: storyId ?? "",
    soundId,
  });

  const handleUpdatingSoundState = (mm?: string) => {
    const value = mm?.trim().length ? mm : soundName;

    if (!soundName?.trim().length && !mm?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initValue === value) {
      return;
    }

    setInitValue(value);
    if (mm?.trim().length) {
      // on button click
      updateSoundText.mutate({ soundName: mm });
    } else if (value.trim().length) {
      if (!allSoundMemoized?.includes(value.toLowerCase())) {
        // suggest to create new sound
        setShowCreateSoundModal(true);
      } else {
        // just updated sound command
        updateSoundText.mutate({ soundName: value });
      }
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
            onBlur={() => handleUpdatingSoundState()}
            value={soundName || ""}
            onChange={(e) => {
              setShowSoundModal(true);
              setSoundName(e.target.value);
              if (onChange) {
                onChange(e.target.value);
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
              onClick={() => {
                setSoundName(mm);
                handleUpdatingSoundState(mm);
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
