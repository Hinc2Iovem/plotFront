import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useModalMovemenetsArrowUpDown from "@/hooks/helpers/keyCombinations/useModalMovemenetsArrowUpDown";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useMemo, useState } from "react";
import useGetAllMusicByStoryId from "../../../hooks/Music/useGetAllMusicByStoryId";
import useUpdateMusicText from "../../../hooks/Music/useUpdateMusicText";

type AllMusicModalTypes = {
  musicName: string;
  storyId: string;
  musicId: string;
  initValue: string;
  setMusicName: React.Dispatch<React.SetStateAction<string>>;
  setShowCreateMusicModal: React.Dispatch<React.SetStateAction<boolean>>;
  setInitValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: string) => void;
};

const AllMusicModal = ({
  storyId,
  musicName,
  musicId,
  initValue,
  setMusicName,
  setShowCreateMusicModal,
  setInitValue,
  onChange,
}: AllMusicModalTypes) => {
  const [showMusicModal, setShowMusicModal] = useState(false);
  const { data: allMusic } = useGetAllMusicByStoryId({
    storyId: storyId || "",
  });

  const allMusicFilteredMemoized = useMemo(() => {
    const res = [...(allMusic || [])];
    if (musicName) {
      const filtered = res?.filter((a) => a.musicName.toLowerCase().includes(musicName.toLowerCase())) || [];
      return filtered.map((f) => f.musicName.toLowerCase());
    } else {
      return res.map((r) => r.musicName.toLowerCase());
    }
  }, [allMusic, musicName]);

  const allMusicMemoized = useMemo(() => {
    return allMusic?.map((a) => a.musicName.toLowerCase()) || [];
  }, [allMusic]);

  const updateMusicText = useUpdateMusicText({
    storyId: storyId || "",
    musicId,
  });

  const handleUpdatingMusicState = (mm?: string) => {
    const value = mm?.trim().length ? mm : musicName;
    if (!value?.trim().length) {
      console.log("Заполните поле");
      return;
    }

    if (initValue === value) {
      return;
    }

    setInitValue(value);
    if (value?.trim().length) {
      // on button click
      updateMusicText.mutate({ musicName: value });
    } else if (allMusicMemoized?.includes(value.toLowerCase())) {
      // just updated music command
      updateMusicText.mutate({ musicName });
    } else {
      // suggest to create new music
      setShowCreateMusicModal(true);
    }
  };

  const buttonsRef = useModalMovemenetsArrowUpDown({ length: allMusicFilteredMemoized.length });

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
            onBlur={() => handleUpdatingMusicState()}
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

      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className={`flex-grow flex flex-col gap-[5px]`}>
        {allMusicFilteredMemoized.length ? (
          allMusicFilteredMemoized.map((mm, i) => (
            <Button
              key={mm + i}
              ref={(el) => (buttonsRef.current[i] = el)}
              type="button"
              onClick={() => {
                setMusicName(mm);
                handleUpdatingMusicState(mm);
                setShowMusicModal(false);
              }}
              className={`whitespace-nowrap text-text h-fit w-full hover:bg-accent border-border border-[1px] focus-within:bg-accent opacity-80 hover:opacity-100 focus-within:opacity-100 flex-wrap rounded-md flex px-[10px] items-center justify-between transition-all `}
            >
              {mm}
            </Button>
          ))
        ) : !musicName?.trim().length ? (
          <Button
            type="button"
            className={`text-start focus-within:bg-accent border-border border-[1px] text-text text-[16px] px-[10px] py-[5px] hover:bg-accent transition-all rounded-md`}
          >
            Пусто
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default AllMusicModal;
