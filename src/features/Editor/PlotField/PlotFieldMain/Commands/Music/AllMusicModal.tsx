import { toastNotificationStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { MusicTypes } from "@/types/StoryData/Music/MusicTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useGetAllMusicByStoryId from "../../../hooks/Music/useGetAllMusicByStoryId";
import ActionButton from "./ActionButton";

export type InitMusicValueTypes = {
  musicId: string;
  musicName: string;
};

type AllMusicModalTypes = {
  initMusicValue: InitMusicValueTypes;
  onBlur: (value: InitMusicValueTypes) => void;
};

export default function AllMusicModal({ initMusicValue, onBlur }: AllMusicModalTypes) {
  const { storyId } = useParams();

  const [musicName, setMusicName] = useState(initMusicValue.musicName || "");

  useEffect(() => {
    if (initMusicValue && !musicName.trim().length) {
      setMusicName(initMusicValue.musicName || "");
    }
  }, [initMusicValue]);

  const [showMusicModal, setShowMusicModal] = useState(false);
  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId || "",
    enabled: !!storyId,
  });

  const allMusicFilteredMemoized = useMemo(() => {
    if (!musicName) return allMusic?.map((a) => a.musicName.toLowerCase()) || [];
    return allMusic?.filter((a) => a.musicName.toLowerCase().includes(musicName.toLowerCase())) || [];
  }, [allMusic, musicName]);

  const allMusicMemoized = useMemo(() => {
    return (
      allMusic?.map((a) => ({
        musicName: a.musicName.toLowerCase(),
        id: a._id,
      })) || []
    );
  }, [allMusic]);

  const handleUpdatingMusicState = async ({ mm }: { mm?: string }) => {
    const value = mm?.trim().length ? mm : musicName;
    if (!value?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initMusicValue.musicName === value) {
      return;
    }

    const foundMusic = allMusicMemoized?.find((s) => s.musicName.trim().toLowerCase() === value.trim().toLowerCase());

    if (!foundMusic?.id) {
      toast("Музыка не найдена, хотите создать?", {
        ...toastNotificationStyles,
        className: "flex text-[18px] text-white justify-between items-center",
        action: <ActionButton text={value.trim()} onBlur={onBlur} />,
      });
      return;
    } else {
      onBlur({ musicId: foundMusic.id, musicName: foundMusic.musicName });
      // just updated music command
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useModalMovemenetsArrowUpDown({
    length: allMusicFilteredMemoized.length,
  });

  return (
    <Popover open={showMusicModal} onOpenChange={setShowMusicModal}>
      <PopoverTrigger asChild>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full"
        >
          <PlotfieldInput
            value={musicName || ""}
            onChange={(e) => {
              setShowMusicModal(true);
              setMusicName(e.target.value);
            }}
            onBlur={() => handleUpdatingMusicState({})}
            placeholder="Музыка"
          />
        </form>
      </PopoverTrigger>

      <PopoverContent
        ref={containerRef}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={`flex-grow flex flex-col gap-[5px]`}
      >
        {allMusicFilteredMemoized.length ? (
          allMusicFilteredMemoized.map((mm, i) => (
            <Button
              key={musicName ? (mm as MusicTypes)._id : (mm as string) + i}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                if (musicName.trim().length) {
                  setMusicName((mm as MusicTypes).musicName);
                  handleUpdatingMusicState({ mm: (mm as MusicTypes).musicName });
                } else {
                  setMusicName(mm as string);
                  handleUpdatingMusicState({ mm: mm as string });
                }
                setShowMusicModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {musicName ? (mm as MusicTypes).musicName : (mm as string)}
            </Button>
          ))
        ) : (
          <Button
            type="button"
            onClick={() => {
              handleUpdatingMusicState({ mm: musicName });
              setShowMusicModal(false);
            }}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
