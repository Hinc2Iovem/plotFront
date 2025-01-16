import { toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useUpdateCommandSound from "../../../hooks/Sound/Command/useUpdateCommandSound";
import useCreateSound from "../../../hooks/Sound/useCreateSound";
import useGetAllSoundByStoryIdAndIsGlobal from "../../../hooks/Sound/useGetAllSoundsByStoryIdAndIsGlobal";

type AllSoundsModalTypes = {
  soundName: string;
  storyId: string;
  initValue: string;
  commandSoundId: string;
  onChange: (value: string) => void;
  setSoundName: React.Dispatch<React.SetStateAction<string>>;
  setInitValue: React.Dispatch<React.SetStateAction<string>>;
};

const AllSoundsModal = ({
  setSoundName,
  initValue,
  soundName,
  storyId,
  commandSoundId,
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
    return (
      allSound?.map((a) => ({
        soundName: a.soundName?.toLowerCase(),
        id: a._id,
      })) || []
    );
  }, [allSound]);

  const updateSoundText = useUpdateCommandSound();

  const createNewSound = useCreateSound({
    storyId: storyId || "",
  });

  const handleUpdatingSoundState = async ({ create, mm }: { mm?: string; create: boolean }) => {
    const value = mm?.trim().length ? mm : soundName;

    if (!value?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initValue === value) {
      return;
    }

    const foundSound = allSoundMemoized?.find((s) => s.soundName.trim().toLowerCase() === value.trim().toLowerCase());

    setInitValue(value);

    if (value.trim().length) {
      if (!foundSound?.id) {
        if (showSoundModal) {
          if (create) {
            toast(`Звук был создан`, toastSuccessStyles);
            const soundId = generateMongoObjectId();
            await createNewSound.mutateAsync({ soundId, soundName: value });
            await updateSoundText.mutateAsync({ commandSoundId, soundId });
            return;
          }
          // when onBlur and jumping to a modal
          return;
        }
      } else {
        // just updated sound command
        updateSoundText.mutate({ commandSoundId, soundId: foundSound.id });
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
                handleUpdatingSoundState({ mm: mm, create: false });
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
              handleUpdatingSoundState({ mm: soundName, create: true });
              setShowSoundModal(false);
            }}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            {soundName?.trim().length ? "Создать" : "Пусто"}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default AllSoundsModal;
