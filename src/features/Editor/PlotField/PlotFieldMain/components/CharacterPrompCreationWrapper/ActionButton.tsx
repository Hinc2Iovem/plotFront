import { Button } from "@/components/ui/button";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type ActionButtonTypes = {
  setCreateNewCharacter: React.Dispatch<React.SetStateAction<boolean>>;
  setStartCreatingCharacter: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ActionButton({ setCreateNewCharacter, setStartCreatingCharacter }: ActionButtonTypes) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Button
      onClick={() => {
        setCreateNewCharacter(false);
        setStartCreatingCharacter(true);
        toast.dismiss();
      }}
      className={`outline-white focus-within:bg-white focus-within:shadow-md focus-within:animate-pulse focus-within:shadow-white hover:bg-white focus-within:text-black hover:text-black text-white transition-all`}
      ref={ref}
    >
      Создать
    </Button>
  );
}
