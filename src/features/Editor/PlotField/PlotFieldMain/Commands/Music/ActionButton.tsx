import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { generateMongoObjectId } from "@/utils/generateMongoObjectId";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { toastSuccessStyles } from "@/components/shared/toastStyles";
import useCreateMusic from "../../../hooks/Music/useCreateMusic";
import { InitMusicValueTypes } from "./AllMusicModal";

type ActionButtonTypes = {
  text: string;
  onBlur?: (value: InitMusicValueTypes) => void;
};

export default function ActionButton({ text, onBlur }: ActionButtonTypes) {
  const { storyId } = useParams();
  const ref = useRef<HTMLButtonElement>(null);
  const createMusic = useCreateMusic({
    storyId: storyId || "",
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Button
      onClick={async () => {
        toast.dismiss();
        const musicId = generateMongoObjectId();

        await createMusic.mutateAsync({ musicId, musicName: text });
        if (onBlur) {
          onBlur({ musicId, musicName: text });
        }
        toast("Музыка создана", toastSuccessStyles);
      }}
      className={`outline-white focus-within:bg-white focus-within:shadow-md focus-within:animate-pulse focus-within:shadow-white hover:bg-white focus-within:text-black hover:text-black text-white transition-all`}
      ref={ref}
    >
      Создать
    </Button>
  );
}
