import { Button } from "@/components/ui/button";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionButtonTypes = {
  setCreateNewEmotion: React.Dispatch<React.SetStateAction<boolean>>;
  setStartCreatingEmotion: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EmotionActionButton({ setCreateNewEmotion, setStartCreatingEmotion }: ActionButtonTypes) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Button
      onClick={() => {
        setCreateNewEmotion(false);
        setStartCreatingEmotion(true);
        toast.dismiss();
      }}
      className={`outline-white focus-within:bg-white focus-within:shadow-md focus-within:animate-pulse focus-within:shadow-white hover:bg-white focus-within:text-black hover:text-black text-white transition-all`}
      ref={ref}
    >
      Создать
    </Button>
  );
}
