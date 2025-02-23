import { toastSuccessStyles } from "@/components/shared/toastStyles";
import { Button } from "@/components/ui/button";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import useCreateSound from "../../../hooks/Sound/useCreateSound";
import { useParams } from "react-router-dom";
import useUpdateCommandSound from "../../../hooks/Sound/Command/useUpdateCommandSound";

type ActionButtonTypes = {
  soundName: string;
  commandSoundId: string;
  setSoundName: React.Dispatch<React.SetStateAction<string>>;
};

export default function SoundActionButton({ commandSoundId, soundName, setSoundName }: ActionButtonTypes) {
  const { storyId } = useParams();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const newSound = useCreateSound({
    storyId: storyId || "",
  });

  const updateSoundText = useUpdateCommandSound();

  const createNewSound = async () => {
    toast(`Звук был создан`, toastSuccessStyles);
    const soundId = generateMongoObjectId();
    setSoundName(soundName);
    await newSound.mutateAsync({ soundId, soundName });
    await updateSoundText.mutateAsync({ commandSoundId, soundId });
  };

  return (
    <Button
      onClick={() => {
        toast.dismiss();
        createNewSound();
      }}
      className={`outline-white focus-within:bg-white focus-within:shadow-md focus-within:animate-pulse focus-within:shadow-white hover:bg-white focus-within:text-black hover:text-black text-white transition-all`}
      ref={ref}
    >
      Создать
    </Button>
  );
}
