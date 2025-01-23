import { toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import { MusicTypes } from "@/types/StoryData/Music/MusicTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import useUpdateCommandMusic from "../../../hooks/Music/Command/useUpdateCommandSound";
import useCreateMusic from "../../../hooks/Music/useCreateMusic";
import useGetAllMusicByStoryId from "../../../hooks/Music/useGetAllMusicByStoryId";

type AllMusicModalTypes = {
  musicName: string;
  storyId: string;
  initValue: string;
  commandMusicId: string;
  setMusicName: React.Dispatch<React.SetStateAction<string>>;
  setInitValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: string) => void;
};

export default function AllMusicModal({
  storyId,
  musicName,
  commandMusicId,
  initValue,
  setMusicName,
  setInitValue,
  onChange,
}: AllMusicModalTypes) {
  const [showMusicModal, setShowMusicModal] = useState(false);
  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId || "",
  });

  const allMusicFilteredMemoized = useMemo(() => {
    if (!musicName) return allMusic?.map((a) => a.musicName.toLowerCase()) || [];
    return allMusic?.filter((a) => a.musicName.toLowerCase().includes(musicName.toLowerCase())) || [];
  }, [allMusic, musicName]);

  const allMusicMemoized =
    allMusic?.map((a) => ({
      musicName: a.musicName.toLowerCase(),
      id: a._id,
    })) || [];

  const updateMusic = useUpdateCommandMusic();

  const createMusic = useCreateMusic({
    storyId,
  });

  const handleUpdatingMusicState = async ({ create, mm }: { mm?: string; create: boolean }) => {
    const value = mm?.trim().length ? mm : musicName;
    if (!value?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initValue === value) {
      return;
    }

    const foundMusic = allMusicMemoized?.find((s) => s.musicName.trim().toLowerCase() === value.trim().toLowerCase());

    setInitValue(value);
    if (value.trim().length) {
      if (!foundMusic?.id) {
        if (showMusicModal) {
          if (create) {
            toast(`Звук был создан`, toastSuccessStyles);
            const musicId = generateMongoObjectId();
            await createMusic.mutateAsync({ musicId, musicName });
            await updateMusic.mutateAsync({ commandMusicId, musicId });
            return;
          }
          // when onBlur and jumping to a modal
          return;
        }
      } else {
        // just updated music command
        updateMusic.mutate({ commandMusicId, musicId: foundMusic.id });
      }
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useModalMovemenetsArrowUpDown({
    length: allMusicFilteredMemoized.length,
    showModal: showMusicModal,
  });

  console.log("allMusicFilteredMemoized:", allMusicFilteredMemoized);

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
              if (onChange) {
                onChange(e.target.value);
              }
            }}
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
                  handleUpdatingMusicState({ mm: (mm as MusicTypes).musicName, create: false });
                } else {
                  setMusicName(mm as string);
                  handleUpdatingMusicState({ mm: mm as string, create: false });
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
              handleUpdatingMusicState({ mm: musicName, create: true });
              setShowMusicModal(false);
            }}
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            {musicName?.trim().length ? "Создать" : "Пусто"}
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
